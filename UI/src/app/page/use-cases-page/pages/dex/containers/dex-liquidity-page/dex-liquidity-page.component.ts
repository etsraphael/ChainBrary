import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail, NetworkChainId, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import {
  INetworkDialogData,
  NetworkDialogComponent
} from '../../../../../../shared/components/modal/network-dialog/network-dialog.component';
import {
  ITokensDialogData,
  TokensDialogComponent
} from '../../../../../../shared/components/modal/tokens-dialog/tokens-dialog.component';
import { tokenList } from '../../../../../../shared/data/tokenList';
import { ILiquidityPayload, IToken } from '../../../../../../shared/interfaces';
import { addLiquidityAction } from '../../../../../../store/swap-store/state/actions';

@Component({
  selector: 'app-dex-liquidity-page',
  templateUrl: './dex-liquidity-page.component.html',
  styleUrl: './dex-liquidity-page.component.scss'
})
export class DexLiquidityPageComponent {
  networkSelected: INetworkDetail = this.web3loginService.getNetworkDetailByChainId(NetworkChainId.POLYGON);
  tokenPath: IToken[] = [
    this.findTokenById(this.networkSelected.nativeCurrency.id) as IToken,
    this.findTokenById(this.networkSelected.nativeCurrency.id) as IToken
  ];
  token1Available: number = 500;
  token2Available: number = 1200;
  totalLiquidity1: number = 9577.514455;
  totalLiquidity2: number = 10831937.7876;

  liquidityForm: FormGroup<ILiquidityForm> = new FormGroup<ILiquidityForm>({
    token1Amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)]),
    token2Amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)])
  });

  constructor(
    private dialog: MatDialog,
    private web3loginService: Web3LoginService,
    private store: Store
  ) {}

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

  openTokensDialog(from: boolean): MatDialogRef<TokensDialogComponent> {
    const data: ITokensDialogData = {
      chainIdSelected: NetworkChainId.POLYGON,
      tokenId: from ? this.tokenPath[0].tokenId : this.tokenPath[1].tokenId
    };

    const dialogRef: MatDialogRef<TokensDialogComponent> = this.dialog.open(TokensDialogComponent, {
      panelClass: ['col-12', 'col-md-8', 'col-lg-6', 'col-xl-5'],
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe((tokenId: TokenId) => {
      if (tokenId) this.handleTokenSelected(tokenId, from);
    });

    return dialogRef;
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

  private handleTokenSelected(tokenId: TokenId, from: boolean): void {
    const token: IToken | undefined = this.findTokenById(tokenId);
    if (!token) return;
    from ? (this.tokenPath[0] = token) : (this.tokenPath[1] = token);
  }

  private handleNetworkSelected(chainId: NetworkChainId): void {
    this.networkSelected = this.web3loginService.getNetworkDetailByChainId(chainId);
  }

  private findTokenById(tokenId: TokenId): IToken | undefined {
    return tokenList.find((token: IToken) => token.tokenId === tokenId);
  }
}

interface ILiquidityForm {
  token1Amount: FormControl<number | null>;
  token2Amount: FormControl<number | null>;
}
