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
  StoreState
} from '../../../../../../shared/interfaces';
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
  selectPoolDetail,
  selectPoolIsNotCreated,
  selectTokensDetails,
  selectTokenSearch
} from '../../../../../../store/swap-store/state/selectors';

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
  readonly poolDetailStore$: Observable<StoreState<IPoolDetail | null>> = this.store.select(selectPoolDetail);
  readonly selectTokensDetails$: Observable<StoreState<BalanceAndAllowance | null>[]> =
    this.store.select(selectTokensDetails);

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

  // TODO: 2. Try this one
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
    const payload: ILiquidityPayload = {
      token1: this.tokenPath[0],
      token2: this.tokenPath[1],
      token1Amount: this.liquidityForm.get('token1Amount')?.value as number,
      token2Amount: this.liquidityForm.get('token2Amount')?.value as number,
      chainId: this.networkSelected.chainId
    };
    return this.store.dispatch(createPoolAction({ payload }));
  }

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

    const payload: IEditAllowancePayload = {
      chainId: this.networkSelected.chainId,
      tokenAddress: tokenAddress,
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      spender: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
      amount
    };

    this.store.dispatch(approveAllowanceAction({ payload }));
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

  // TODO: 1. Add real values to the parameters
  private handleTokenSelected(token: IToken, tokenIn: boolean): void {
    tokenIn ? (this.tokenPath[0] = token) : (this.tokenPath[1] = token);
    const tokenAddress: string = token.networkSupport.find(
      (tokenContract) => tokenContract.chainId === this.networkSelected.chainId
    )?.address as string;

    const payload: IBalanceAndAllowancePayload = {
      chainId: this.networkSelected.chainId,
      tokenId: token.tokenId,
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
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

  private fetchFormValues(): void {
    const token1: string | null = this.route.snapshot.queryParamMap.get('token1');
    const token2: string | null = this.route.snapshot.queryParamMap.get('token2');
    const chainId: string | null = this.route.snapshot.queryParamMap.get('chainId');
    console.log(token1, token2, chainId);

    if (!token1 || !token2 || !chainId) return;
    console.log('fetchFormValues');

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
