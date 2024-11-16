import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail, NetworkChainId, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
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
  IQuoteResult,
  ISwappingPayload,
  IToken,
  ITokenContract,
  StoreState,
  SwapPayload
} from './../../../../../../shared/interfaces';
import { approveAllowanceAction, loadBalanceAndAllowanceAction, loadQuoteAction, swapAction } from './../../../../../../store/swap-store/state/actions';
import { selectQuote, selectTokensDetails, selectTokenSearch } from './../../../../../../store/swap-store/state/selectors';
import { IEditAllowancePayload } from '@chainbrary/token-bridge';

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
    fromAmount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)])
  });

  readonly quote$: Observable<StoreState<IQuoteResult | null>> = this.store.select(selectQuote);
  readonly selectTokensDetails$: Observable<StoreState<BalanceAndAllowance | null>[]> =
    this.store.select(selectTokensDetails);

  constructor(
    private dialog: MatDialog,
    private web3loginService: Web3LoginService,
    private store: Store
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
      amount: '1',
      slippage: '1',
      deadline: '1',
      recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      chainId: NetworkChainId.LOCALHOST
    };

    return this.store.dispatch(loadQuoteAction({ payload }));
  }

  approveToken(tokenIn: boolean): void {
    const amount = tokenIn ? (this.swapForm.get('fromAmount')?.value as number ) : 1;
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
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      tokenAddress: tokenAddress,
      spender: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
      tokenIn
    };

    this.store.dispatch(loadBalanceAndAllowanceAction({ payload }));

  }

  private handleNetworkSelected(chainId: NetworkChainId, from: boolean): void {
    if (from) {
      this.networkPath[0] = this.web3loginService.getNetworkDetailByChainId(chainId);
    } else {
      this.networkPath[1] = this.web3loginService.getNetworkDetailByChainId(chainId);
    }
  }

  private findTokenById(tokenId: TokenId): IToken | undefined {
    return tokenList.find((token: IToken) => token.tokenId === tokenId);
  }
}

interface ISwappingForm {
  fromAmount: FormControl<number | null>;
}
