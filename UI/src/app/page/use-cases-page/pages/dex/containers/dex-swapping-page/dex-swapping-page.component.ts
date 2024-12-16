import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { INetworkDetail, NetworkChainId, WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  ReplaySubject,
  skipWhile,
  take,
  takeUntil
} from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { DefaultNetworkPair, DefaultNetworkPairs } from '../../../../../../shared/data/dex.data';
import {
  INetworkDialogData,
  NetworkDialogComponent
} from './../../../../../../shared/components/modal/network-dialog/network-dialog.component';
import {
  ITokensDialogData,
  TokensDialogComponent
} from './../../../../../../shared/components/modal/tokens-dialog/tokens-dialog.component';
import {
  ActionStoreProcessing,
  BalanceAndAllowance,
  IBalanceAndAllowancePayload,
  IPoolDetail,
  IPoolSearch,
  IQuoteResult,
  ISwappingPayload,
  IToken,
  ITokenContract,
  ITransactionCard,
  StoreState,
  SwapPayload
} from './../../../../../../shared/interfaces';
import { selectWalletConnected } from './../../../../../../store/global-store/state/selectors';
import {
  approveAllowanceAction,
  loadBalanceAndAllowanceAction,
  loadPoolAction,
  loadQuoteAction,
  preloadLiquidityFormAction,
  preloadLiquidityFormActionSuccess,
  swapAction
} from './../../../../../../store/swap-store/state/actions';
import {
  selectIsSwapping,
  selectPoolDetail,
  selectQuote,
  selectSwapApproval,
  selectTokensDetails,
  selectTokenSearch
} from './../../../../../../store/swap-store/state/selectors';
import { selectRecentTransactionsByComponent } from './../../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-dex-swapping-page',
  templateUrl: './dex-swapping-page.component.html',
  styleUrls: ['./dex-swapping-page.component.scss']
})
export class DexSwappingPageComponent implements OnInit, OnDestroy {
  networkPath: INetworkDetail[] = [
    this.web3loginService.getNetworkDetailByChainId(NetworkChainId.POLYGON),
    this.web3loginService.getNetworkDetailByChainId(NetworkChainId.POLYGON)
  ];
  tokenPath: IToken[] = [];
  swapForm: FormGroup<ISwappingForm> = new FormGroup<ISwappingForm>({
    fromAmount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)]),
    toAmount: new FormControl<number | null>(null, [Validators.required])
  });
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  readonly quote$: Observable<StoreState<IQuoteResult | null>> = this.store.select(selectQuote);
  readonly selectTokensDetails$: Observable<StoreState<BalanceAndAllowance | null>[]> =
    this.store.select(selectTokensDetails);
  readonly selectWalletConnected$: Observable<WalletProvider | null> = this.store.select(selectWalletConnected);
  readonly transactionCards$: Observable<ITransactionCard[]> = this.store.select(
    selectRecentTransactionsByComponent('DexSwappingPageComponent')
  );
  readonly isSwapping$: Observable<ActionStoreProcessing> = this.store.select(selectIsSwapping);
  readonly poolDetailStore$: Observable<StoreState<IPoolDetail | null>> = this.store.select(selectPoolDetail);
  readonly swapApproval$: Observable<ActionStoreProcessing[]> = this.store.select(selectSwapApproval);

  get showErrorMessage$(): Observable<string | null> {
    return combineLatest([this.isSwapping$, this.swapApproval$]).pipe(
      map(
        ([isSwapping, swapApproval]) =>
          isSwapping.errorMessage || swapApproval[0].errorMessage || swapApproval[1].errorMessage || null
      )
    );
  }

  get token1Available$(): Observable<BalanceAndAllowance | null> {
    return this.selectTokensDetails$.pipe(
      map((storeState: StoreState<BalanceAndAllowance | null>[]) => storeState[0]?.data || null)
    );
  }

  get allowance1Needed$(): Observable<boolean> {
    return this.token1Available$.pipe(
      map((balanceAndAllowance: BalanceAndAllowance | null) => {
        return Number(balanceAndAllowance?.allowance) < Number(this.swapForm.get('fromAmount')?.value);
      })
    );
  }

  get tokenQuoteText$(): Observable<string> {
    return this.quote$.pipe(
      map((quote: StoreState<IQuoteResult | null>) => {
        if (quote.data) {
          return `1 ${this.tokenPath[0].symbol} = ${quote.data.token1} ${this.tokenPath[1].symbol}`;
        }
        return '';
      })
    );
  }

  get poolDetail$(): Observable<IPoolDetail | null> {
    return this.poolDetailStore$.pipe(map((storeState: StoreState<IPoolDetail | null>) => storeState.data));
  }

  get poolIsEmpty$(): Observable<boolean> {
    return this.poolDetail$.pipe(
      map(
        (poolDetail: IPoolDetail | null) =>
          poolDetail?.token1Amount?.toString() === '0' && poolDetail?.token2Amount?.toString() === '0'
      )
    );
  }

  get poolIsNotFound$(): Observable<boolean> {
    return this.poolDetailStore$.pipe(
      map((storeState: StoreState<IPoolDetail | null>) => storeState.error === 'Pool_not_found')
    );
  }

  constructor(
    private dialog: MatDialog,
    private web3loginService: Web3LoginService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.setUpDefaultNetworkPair(this.networkPath[0].chainId);
    this.loadPool();
    this.fetchFormValues();
    this.listenFormChanges();
    this.listenToQuote();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  openNetworkDialog(from: boolean): MatDialogRef<NetworkDialogComponent> {
    const data: INetworkDialogData = {
      chainIdSelected: from ? this.networkPath[0].chainId : this.networkPath[1].chainId
    };

    const dialogRef: MatDialogRef<NetworkDialogComponent> = this.dialog.open(NetworkDialogComponent, {
      panelClass: ['col-12', 'col-md-8', 'col-lg-6', 'col-xl-5'],
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe((chainId: NetworkChainId) => {
      if (chainId) this.handleNetworkSelected(chainId, from);
    });

    return dialogRef;
  }

  openTokensDialog(from: boolean): MatDialogRef<TokensDialogComponent> {
    const data: ITokensDialogData = {
      chainIdSelected: from ? this.networkPath[0].chainId : this.networkPath[1].chainId,
      tokenId: from ? this.tokenPath[0].tokenId : this.tokenPath[1].tokenId,
      tokenSearch$: this.store.select(selectTokenSearch)
    };

    const dialogRef: MatDialogRef<TokensDialogComponent> = this.dialog.open(TokensDialogComponent, {
      panelClass: ['col-12', 'col-md-8', 'col-lg-6', 'col-xl-5'],
      autoFocus: false,
      data
    });

    dialogRef
      .afterClosed()
      .subscribe((token: IToken | null) => (token ? this.handleTokenSelected(token, from, false) : null));

    return dialogRef;
  }

  sendSwapRequest(): void {
    this.swapForm.markAllAsTouched();
    if (this.swapForm.invalid) return;

    const token0Address: string = this.tokenPath[0].networkSupport.find(
      (network: ITokenContract) => network.chainId === this.networkPath[0].chainId
    )?.address as string;
    const token1Address: string = this.tokenPath[1].networkSupport.find(
      (network: ITokenContract) => network.chainId === this.networkPath[1].chainId
    )?.address as string;
    const fromAmount: string = (this.swapForm.get('fromAmount')?.value as number).toString();

    const payload: ISwappingPayload = {
      chainId: this.networkPath[0].chainId,
      amount: fromAmount,
      amountOutMin: '1',
      path: [token0Address, token1Address],
      fees: 500
    };

    this.store.dispatch(swapAction({ payload }));
  }

  approveToken(tokenIn: boolean): void {
    const amount = tokenIn ? (this.swapForm.get('fromAmount')?.value as number) : 1;
    const tokenAddress: string = this.tokenPath[tokenIn ? 0 : 1].networkSupport.find(
      (network: ITokenContract) => network.chainId === this.networkPath[tokenIn ? 0 : 1].chainId
    )?.address as string;

    return this.store.dispatch(
      approveAllowanceAction({
        chainId: this.networkPath[0].chainId,
        tokenAddress: tokenAddress,
        view: 'swap',
        amount,
        spender: environment.contracts.swapRouter.contracts.find(
          (contract) => contract.chainId === this.networkPath[0].chainId
        )?.address as string,
        tokenId: this.tokenPath[tokenIn ? 0 : 1].tokenId
      })
    );
  }

  loadPool(): void {
    this.loadQuote();
    const payload: IPoolSearch = {
      token1Address: this.tokenPath[0].networkSupport.find(
        (tokenContract) => tokenContract.chainId === this.networkPath[0].chainId
      )?.address as string,
      token2Address: this.tokenPath[1].networkSupport.find(
        (tokenContract) => tokenContract.chainId === this.networkPath[0].chainId
      )?.address as string,
      chainId: this.networkPath[0].chainId
    };
    return this.store.dispatch(loadPoolAction({ payload }));
  }

  private loadQuote(): void {
    const payload: SwapPayload = {
      from: this.tokenPath[0],
      to: this.tokenPath[1],
      amount: (this.swapForm.get('fromAmount')?.value ?? 1).toString(),
      slippage: '0.5',
      deadline: '1',
      chainId: this.networkPath[0].chainId
    };

    return this.store.dispatch(loadQuoteAction({ payload }));
  }

  private handleTokenSelected(token: IToken, tokenIn: boolean, skipRouteConfig: boolean): void {
    tokenIn ? (this.tokenPath[0] = token) : (this.tokenPath[1] = token);

    const tokenAddress: string = token.networkSupport.find(
      (network: ITokenContract) => network.chainId === this.networkPath[tokenIn ? 0 : 1].chainId
    )?.address as string;

    const payload: IBalanceAndAllowancePayload = {
      chainId: this.networkPath[0].chainId,
      tokenId: this.tokenPath[tokenIn ? 0 : 1].tokenId,
      tokenAddress: tokenAddress,
      spender: environment.contracts.swapRouter.contracts.find(
        (contract) => contract.chainId === this.networkPath[0].chainId
      )?.address as string,
      tokenIn
    };

    !skipRouteConfig
      ? this.router.navigate([], {
          queryParams: {
            [tokenIn ? 'token1' : 'token2']: tokenAddress
          },
          queryParamsHandling: 'merge'
        })
      : null;

    this.selectWalletConnected$
      .pipe(
        skipWhile((wallet: WalletProvider | null) => !wallet),
        take(1)
      )
      .subscribe(() => this.store.dispatch(loadBalanceAndAllowanceAction({ payload })));
  }

  private handleNetworkSelected(chainId: NetworkChainId, from: boolean): void {
    if (from) {
      this.networkPath[0] = this.web3loginService.getNetworkDetailByChainId(chainId);
    } else {
      this.networkPath[1] = this.web3loginService.getNetworkDetailByChainId(chainId);
    }

    this.router.navigate([], {
      queryParams: {
        [from ? 'chainIdIn' : 'chainIdOut']: chainId
      },
      queryParamsHandling: 'merge'
    });
  }

  private fetchFormValues(): void {
    const token1: string | null = this.route.snapshot.queryParamMap.get('token1');
    const token2: string | null = this.route.snapshot.queryParamMap.get('token2');
    const chainIdIn: string | null = this.route.snapshot.queryParamMap.get('chainIdIn');

    if (!token1 || !token2 || !chainIdIn) {
      // Set the default tokenPath
      this.handleTokenSelected(this.tokenPath[0], true, true);
      this.handleTokenSelected(this.tokenPath[1], false, true);
      return;
    }

    const payload: IPoolSearch = {
      token1Address: token1 as string,
      token2Address: token2 as string,
      chainId: chainIdIn as NetworkChainId
    };

    this.store.dispatch(preloadLiquidityFormAction({ payload }));

    this.actions$
      .pipe(ofType(preloadLiquidityFormActionSuccess), takeUntil(this.destroyed$), take(1))
      .subscribe((action: ReturnType<typeof preloadLiquidityFormActionSuccess>) => {
        // Set the tokenPath
        this.handleTokenSelected(action.result.token1, true, true);
        this.handleTokenSelected(action.result.token2, false, true);
        // Set the networkSelected
        this.networkPath = [
          this.web3loginService.getNetworkDetailByChainId(action.result.chainId as NetworkChainId),
          this.web3loginService.getNetworkDetailByChainId(action.result.chainId as NetworkChainId)
        ];
        // Set fromAmount to 1
        this.swapForm.get('fromAmount')?.setValue(1);
        // Load the quote
        this.loadPool();
      });
  }

  private listenFormChanges(): void {
    const updateAmount = (
      source: string,
      target: string,
      factor: (value: number, quote: { token1: number }) => number
    ): void => {
      this.swapForm
        .get(source)
        ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(1500))
        .subscribe((value: number | null) => {
          this.quote$.pipe(take(1)).subscribe((quote: StoreState<IQuoteResult | null>) => {
            if (value && quote.data?.token1 && quote.data) {
              const result: number = factor(value, quote.data);
              this.swapForm.get(target)?.setValue(parseFloat(result.toFixed(6)));
            }
          });
        });
    };

    // listen to input 1 and 2
    updateAmount('fromAmount', 'toAmount', (value, quote) => value * quote.token1);
    updateAmount('toAmount', 'fromAmount', (value, quote) => value / quote.token1);
  }

  private listenToQuote(): void {
    this.poolDetailStore$.pipe(takeUntil(this.destroyed$)).subscribe((quote: StoreState<IPoolDetail | null>) => {
      quote.loading ? this.swapForm.disable() : this.swapForm.enable();
    });
  }

  private setUpDefaultNetworkPair(chainId: NetworkChainId): void {
    const foundDefaultNetworkPair: DefaultNetworkPair | undefined = DefaultNetworkPairs.find(
      (defaultNetworkPair) => defaultNetworkPair.chainId === chainId
    );
    if (foundDefaultNetworkPair) {
      this.tokenPath[0] = foundDefaultNetworkPair.token1;
      this.tokenPath[1] = foundDefaultNetworkPair.token2;
    }
  }
}

interface ISwappingForm {
  fromAmount: FormControl<number | null>;
  toAmount: FormControl<number | null>;
}
