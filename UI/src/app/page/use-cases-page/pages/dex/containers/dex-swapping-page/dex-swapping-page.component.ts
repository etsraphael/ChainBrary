import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IEditAllowancePayload } from '@chainbrary/token-bridge';
import { INetworkDetail, NetworkChainId, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import {
  INetworkDialogData,
  NetworkDialogComponent
} from './../../../../../../shared/components/modal/network-dialog/network-dialog.component';
import {
  ITokensDialogData,
  TokensDialogComponent
} from './../../../../../../shared/components/modal/tokens-dialog/tokens-dialog.component';
import { tokenList } from './../../../../../../shared/data/tokenList';
import {
  BalanceAndAllowance,
  IBalanceAndAllowancePayload,
  IPoolSearch,
  IQuoteResult,
  ISwappingPayload,
  IToken,
  ITokenContract,
  StoreState,
  SwapPayload
} from './../../../../../../shared/interfaces';
import {
  approveAllowanceAction,
  loadBalanceAndAllowanceAction,
  loadQuoteAction,
  preloadLiquidityFormAction,
  preloadLiquidityFormActionSuccess,
  swapAction
} from './../../../../../../store/swap-store/state/actions';
import {
  selectQuote,
  selectTokensDetails,
  selectTokenSearch
} from './../../../../../../store/swap-store/state/selectors';

@Component({
  selector: 'app-dex-swapping-page',
  templateUrl: './dex-swapping-page.component.html',
  styleUrls: ['./dex-swapping-page.component.scss']
})
export class DexSwappingPageComponent implements OnInit {
  networkPath: INetworkDetail[] = [
    this.web3loginService.getNetworkDetailByChainId(NetworkChainId.LOCALHOST),
    this.web3loginService.getNetworkDetailByChainId(NetworkChainId.LOCALHOST)
  ];
  tokenPath: IToken[] = [
    this.findTokenById(this.networkPath[0].nativeCurrency.id) as IToken,
    this.findTokenById(this.networkPath[1].nativeCurrency.id) as IToken
  ];

  swapForm: FormGroup<ISwappingForm> = new FormGroup<ISwappingForm>({
    fromAmount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)]),
    toAmount: new FormControl<number | null>(null, [Validators.required])
  });

  readonly quote$: Observable<StoreState<IQuoteResult | null>> = this.store.select(selectQuote);
  readonly selectTokensDetails$: Observable<StoreState<BalanceAndAllowance | null>[]> =
    this.store.select(selectTokensDetails);

  constructor(
    private dialog: MatDialog,
    private web3loginService: Web3LoginService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.fetchFormValues();
    this.listenFormChanges();
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

  openNetowkDialog(from: boolean): MatDialogRef<NetworkDialogComponent> {
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

    dialogRef.afterClosed().subscribe((token: IToken | null) => (token ? this.handleTokenSelected(token, from) : null));

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
      fees: 500,
      to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    };

    this.store.dispatch(swapAction({ payload }));
  }

  loadQuote(): void {
    const payload: SwapPayload = {
      from: this.tokenPath[0],
      to: this.tokenPath[1],
      amount: (this.swapForm.get('fromAmount')?.value ?? 1).toString(),
      slippage: '0.5',
      deadline: '1',
      recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      chainId: NetworkChainId.LOCALHOST
    };

    return this.store.dispatch(loadQuoteAction({ payload }));
  }

  approveToken(tokenIn: boolean): void {
    const amount = tokenIn ? (this.swapForm.get('fromAmount')?.value as number) : 1;
    const tokenAddress: string = this.tokenPath[tokenIn ? 0 : 1].networkSupport.find(
      (network: ITokenContract) => network.chainId === this.networkPath[tokenIn ? 0 : 1].chainId
    )?.address as string;

    const payload: IEditAllowancePayload = {
      chainId: this.networkPath[0].chainId,
      tokenAddress: tokenAddress,
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      spender: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      amount
    };

    this.store.dispatch(approveAllowanceAction({ payload }));
  }

  private handleTokenSelected(token: IToken, tokenIn: boolean): void {
    tokenIn ? (this.tokenPath[0] = token) : (this.tokenPath[1] = token);

    const tokenAddress: string = token.networkSupport.find(
      (network: ITokenContract) => network.chainId === this.networkPath[tokenIn ? 0 : 1].chainId
    )?.address as string;

    const payload: IBalanceAndAllowancePayload = {
      chainId: this.networkPath[0].chainId,
      tokenId: this.tokenPath[tokenIn ? 0 : 1].tokenId,
      // from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      tokenAddress: tokenAddress,
      spender: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
      tokenIn
    };

    this.store.dispatch(loadBalanceAndAllowanceAction({ payload }));

    this.router.navigate([], {
      queryParams: {
        [tokenIn ? 'token1' : 'token2']: tokenAddress
      },
      queryParamsHandling: 'merge'
    });
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

  private findTokenById(tokenId: TokenId): IToken | undefined {
    return tokenList.find((token: IToken) => token.tokenId === tokenId);
  }

  private fetchFormValues(): void {
    const token1: string | null = this.route.snapshot.queryParamMap.get('token1');
    const token2: string | null = this.route.snapshot.queryParamMap.get('token2');
    const chainIdIn: string | null = this.route.snapshot.queryParamMap.get('chainIdIn');

    if (!token1 || !token2 || !chainIdIn) return;

    const payload: IPoolSearch = {
      token1Address: token1 as string,
      token2Address: token2 as string,
      chainId: chainIdIn as NetworkChainId
    };

    this.store.dispatch(preloadLiquidityFormAction({ payload }));

    this.actions$
      .pipe(ofType(preloadLiquidityFormActionSuccess), take(1))
      .subscribe((action: ReturnType<typeof preloadLiquidityFormActionSuccess>) => {
        // Set the tokenPath
        this.handleTokenSelected(action.result.token1, true);
        this.handleTokenSelected(action.result.token2, false);
        // Set the networkSelected
        this.networkPath = [
          this.web3loginService.getNetworkDetailByChainId(action.result.chainId as NetworkChainId),
          this.web3loginService.getNetworkDetailByChainId(action.result.chainId as NetworkChainId)
        ];
        // Set fromAmount to 1
        this.swapForm.get('fromAmount')?.setValue(1);
        // Load the quote
        this.loadQuote();
      });
  }

  // private listenToQuoteChanges(): void {
  //   this.quote$.subscribe((quote: StoreState<IQuoteResult | null>) => {
  //     if (quote.loading === true) {
  //       // if first input is focused, freeze the second input
  //       if (
  //         document.activeElement === document.getElementById('fromAmount') &&
  //         this.swapForm.get('fromAmount')?.value !== null
  //       ) {
  //         this.swapForm.get('toAmount')?.disable();
  //       }
  //     }
  //   });
  // }

  private listenFormChanges(): void {
    const updateAmount = (source: string, target: string, factor: (value: number, quote: IQuoteResult) => number): void => {
      this.swapForm.get(source)?.valueChanges.subscribe((value: number | null) => {
        this.quote$.pipe(take(1)).subscribe((quote: StoreState<IQuoteResult | null>) => {
          if (value && quote.data) {
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
}

interface ISwappingForm {
  fromAmount: FormControl<number | null>;
  toAmount: FormControl<number | null>;
}
