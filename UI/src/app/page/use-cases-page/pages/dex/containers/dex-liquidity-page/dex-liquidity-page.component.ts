import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { INetworkDetail, NetworkChainId, TokenId, WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';
import {
  INetworkDialogData,
  NetworkDialogComponent
} from '../../../../../../shared/components/modal/network-dialog/network-dialog.component';
import {
  ITokensDialogData,
  TokensDialogComponent
} from '../../../../../../shared/components/modal/tokens-dialog/tokens-dialog.component';
import { tokenList } from '../../../../../../shared/data/tokenList';
import {
  BalanceAndAllowance,
  IBalanceAndAllowancePayload,
  ILiquidityPayload,
  IPoolDetail,
  IPoolSearch,
  IToken,
  ITransactionCard,
  StoreState
} from '../../../../../../shared/interfaces';
import { selectWalletConnected } from '../../../../../../store/global-store/state/selectors';
import {
  addLiquidityAction,
  approveAllowanceAction,
  createPoolAction,
  loadBalanceAndAllowanceAction,
  loadPoolAction,
  preloadLiquidityFormAction,
  preloadLiquidityFormActionSuccess
} from '../../../../../../store/swap-store/state/actions';
import {
  selectIsPoolCreating,
  selectLiquidityApproval,
  selectPoolDetail,
  selectPoolIsNotCreated,
  selectTokensDetails,
  selectTokenSearch
} from '../../../../../../store/swap-store/state/selectors';
import { selectRecentTransactionsByComponent } from '../../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-dex-liquidity-page',
  templateUrl: './dex-liquidity-page.component.html',
  styleUrl: './dex-liquidity-page.component.scss'
})
export class DexLiquidityPageComponent implements OnInit {
  networkSelected: INetworkDetail = this.web3loginService.getNetworkDetailByChainId(NetworkChainId.LOCALHOST);
  tokenPath: IToken[] = [this.findTokenById('usdc') as IToken, this.findTokenById('chainlink') as IToken];
  liquidityForm: FormGroup<ILiquidityForm> = new FormGroup<ILiquidityForm>({
    token1Amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)]),
    token2Amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)])
  });

  constructor(
    private dialog: MatDialog,
    private web3loginService: Web3LoginService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {}

  readonly poolIsNotCreated$: Observable<boolean> = this.store.select(selectPoolIsNotCreated);
  readonly poolIsCreating$: Observable<boolean> = this.store.select(selectIsPoolCreating);
  readonly poolDetailStore$: Observable<StoreState<IPoolDetail | null>> = this.store.select(selectPoolDetail);
  readonly selectTokensDetails$: Observable<StoreState<BalanceAndAllowance | null>[]> =
    this.store.select(selectTokensDetails);
  readonly selectWalletConnected$: Observable<WalletProvider | null> = this.store.select(selectWalletConnected);
  readonly transactionCards$: Observable<ITransactionCard[]> = this.store.select(
    selectRecentTransactionsByComponent('DexLiquidityPageComponent')
  );
  readonly liquidityApproval$: Observable<boolean[]> = this.store.select(selectLiquidityApproval);

  get poolDetail$(): Observable<IPoolDetail | null> {
    return this.poolDetailStore$.pipe(map((storeState: StoreState<IPoolDetail | null>) => storeState.data));
  }

  get poolIsLoading$(): Observable<boolean> {
    return this.poolDetailStore$.pipe(map((storeState: StoreState<IPoolDetail | null>) => storeState.loading));
  }

  get token1Available$(): Observable<BalanceAndAllowance | null> {
    return this.selectTokensDetails$.pipe(
      map((storeState: StoreState<BalanceAndAllowance | null>[]) => storeState[0]?.data || null)
    );
  }

  get token2Available$(): Observable<BalanceAndAllowance | null> {
    return this.selectTokensDetails$.pipe(
      map((storeState: StoreState<BalanceAndAllowance | null>[]) => storeState[1]?.data || null)
    );
  }

  get allowance1Needed$(): Observable<boolean> {
    return this.token1Available$.pipe(
      map((balanceAndAllowance: BalanceAndAllowance | null) => {
        return Number(balanceAndAllowance?.allowance) < Number(this.liquidityForm.get('token1Amount')?.value);
      })
    );
  }

  get allowance2Needed$(): Observable<boolean> {
    return this.token2Available$.pipe(
      map((balanceAndAllowance: BalanceAndAllowance | null) => {
        return Number(balanceAndAllowance?.allowance) < Number(this.liquidityForm.get('token2Amount')?.value);
      })
    );
  }

  ngOnInit(): void {
    this.fetchFormValues();
  }

  openNetworkDialog(): MatDialogRef<NetworkDialogComponent> {
    const data: INetworkDialogData = {
      chainIdSelected: NetworkChainId.POLYGON
    };

    const dialogRef: MatDialogRef<NetworkDialogComponent> = this.dialog.open(NetworkDialogComponent, {
      panelClass: ['col-12', 'col-md-8', 'col-lg-6', 'col-xl-5'],
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe((chainId: NetworkChainId) => {
      if (chainId) this.handleNetworkSelected(chainId);
    });

    return dialogRef;
  }

  openTokensDialog(tokenIn: boolean): MatDialogRef<TokensDialogComponent> {
    const data: ITokensDialogData = {
      chainIdSelected: this.networkSelected.chainId,
      tokenId: tokenIn ? this.tokenPath[0].tokenId : this.tokenPath[1].tokenId,
      tokenSearch$: this.store.select(selectTokenSearch)
    };

    const dialogRef: MatDialogRef<TokensDialogComponent> = this.dialog.open(TokensDialogComponent, {
      panelClass: ['col-12', 'col-md-8', 'col-lg-6', 'col-xl-5'],
      autoFocus: false,
      data
    });

    dialogRef
      .afterClosed()
      .pipe()
      .subscribe((token: IToken | null) => {
        token ? this.handleTokenSelected(token, tokenIn) : null;
      });

    return dialogRef;
  }

  // round number to 6 decimal places
  roundNumber(num: string): string {
    const [integerPart, decimalPart = ''] = num.split('.');
    if (decimalPart.length <= 3) return `${integerPart}.${decimalPart.padEnd(3, '0')}`;

    const roundedDecimal = Math.round(parseInt(decimalPart.slice(0, 4)) / 10)
      .toString()
      .padEnd(3, '0');
    if (roundedDecimal.length > 3) return `${(BigInt(integerPart) + BigInt(1)).toString()}.000`;

    return `${integerPart}.${roundedDecimal}`;
  }

  addLiquidity(): void {
    this.liquidityForm.markAllAsTouched();
    if (this.liquidityForm.invalid) return;

    const payload: ILiquidityPayload = {
      token1: this.tokenPath[0],
      token2: this.tokenPath[1],
      token1Amount: this.liquidityForm.get('token1Amount')?.value as number,
      token2Amount: this.liquidityForm.get('token2Amount')?.value as number,
      chainId: this.networkSelected.chainId
    };

    return this.store.dispatch(addLiquidityAction({ payload }));
  }

  createPool(): void {
    const payload: IPoolSearch = {
      token1Address: this.tokenPath[0].networkSupport.find(
        (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
      )?.address as string,
      token2Address: this.tokenPath[1].networkSupport.find(
        (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
      )?.address as string,
      chainId: this.networkSelected.chainId
    };
    return this.store.dispatch(createPoolAction({ payload }));
  }

  // Add loading animation here and disable the button while loading
  approveToken(tokenIn: boolean): void {
    const amount = tokenIn
      ? (this.liquidityForm.get('token1Amount')?.value as number)
      : (this.liquidityForm.get('token2Amount')?.value as number);
    const tokenAddress: string = tokenIn
      ? (this.tokenPath[0].networkSupport.find(
          (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
        )?.address as string)
      : (this.tokenPath[1].networkSupport.find(
          (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
        )?.address as string);

    this.poolDetail$.pipe(take(1)).subscribe((pool: IPoolDetail | null) => {
      return this.store.dispatch(
        approveAllowanceAction({
          chainId: this.networkSelected.chainId,
          tokenAddress: tokenAddress,
          view: 'liquidity',
          amount,
          spender: pool?.contractAddress as string
        })
      );
    });
  }

  private loadPool(): void {
    const payload: IPoolSearch = {
      token1Address: this.tokenPath[0].networkSupport.find(
        (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
      )?.address as string,
      token2Address: this.tokenPath[1].networkSupport.find(
        (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
      )?.address as string,
      chainId: this.networkSelected.chainId
    };
    return this.store.dispatch(loadPoolAction({ payload }));
  }

  private handleTokenSelected(token: IToken, tokenIn: boolean): void {
    tokenIn ? (this.tokenPath[0] = token) : (this.tokenPath[1] = token);
    const tokenAddress: string = token.networkSupport.find(
      (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
    )?.address as string;

    this.router.navigate([], {
      queryParams: {
        [tokenIn ? 'token1' : 'token2']: tokenAddress,
        chainId: this.networkSelected.chainId
      },
      queryParamsHandling: 'merge'
    });

    this.loadPool();

    // Check allowance for pool
    combineLatest([this.selectWalletConnected$, this.poolDetail$])
      .pipe(
        skipWhile(([walletConnected, poolDetail]) => !walletConnected || !poolDetail?.contractAddress),
        take(1),
        map(([, poolDetail]) => poolDetail as IPoolDetail)
      )
      .subscribe((poolDetail: IPoolDetail) => {
        const payload: IBalanceAndAllowancePayload = {
          chainId: this.networkSelected.chainId,
          tokenId: token.tokenId,
          tokenAddress: tokenAddress,
          spender: poolDetail.contractAddress,
          tokenIn
        };

        this.store.dispatch(loadBalanceAndAllowanceAction({ payload }));
      });
  }

  private fetchFormValues(): void {
    const token1: string | null = this.route.snapshot.queryParamMap.get('token1');
    const token2: string | null = this.route.snapshot.queryParamMap.get('token2');
    const chainId: string | null = this.route.snapshot.queryParamMap.get('chainId');

    if (!token1 || !token2 || !chainId) return;

    const payload: IPoolSearch = {
      token1Address: token1 as string,
      token2Address: token2 as string,
      chainId: NetworkChainId.LOCALHOST
    };

    this.store.dispatch(preloadLiquidityFormAction({ payload }));

    // Handle preloadLiquidityFormActionSuccess here, and set the form values
    this.actions$
      .pipe(ofType(preloadLiquidityFormActionSuccess), take(1))
      .subscribe((action: ReturnType<typeof preloadLiquidityFormActionSuccess>) => {
        // Set the tokenPath
        this.handleTokenSelected(action.result.token1, true);
        this.handleTokenSelected(action.result.token2, false);
        // Set the networkSelected
        this.networkSelected = this.web3loginService.getNetworkDetailByChainId(chainId);
      });
  }

  private handleNetworkSelected(chainId: NetworkChainId): void {
    this.networkSelected = this.web3loginService.getNetworkDetailByChainId(chainId);

    this.router.navigate([], {
      queryParams: {
        chainId
      },
      queryParamsHandling: 'merge'
    });
  }

  private findTokenById(tokenId: TokenId | string): IToken | undefined {
    return tokenList.find((token: IToken) => token.tokenId === tokenId);
  }
}

interface ILiquidityForm {
  token1Amount: FormControl<number | null>;
  token2Amount: FormControl<number | null>;
}
