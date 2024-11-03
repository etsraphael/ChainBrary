import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail, NetworkChainId, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { swapAction } from 'src/app/store/swap-store/state/actions';
import {
  INetworkDialogData,
  NetworkDialogComponent
} from './../../../../../../shared/components/modal/network-dialog/network-dialog.component';
import {
  ITokensDialogData,
  TokensDialogComponent
} from './../../../../../../shared/components/modal/tokens-dialog/tokens-dialog.component';
import { tokenList } from './../../../../../../shared/data/tokenList';
import { IToken, QuotePayload } from './../../../../../../shared/interfaces';

@Component({
  selector: 'app-dex-swapping-page',
  templateUrl: './dex-swapping-page.component.html',
  styleUrls: ['./dex-swapping-page.component.scss']
})
export class DexSwappingPageComponent {
  networkPath: INetworkDetail[] = [
    this.web3loginService.getNetworkDetailByChainId(NetworkChainId.POLYGON),
    this.web3loginService.getNetworkDetailByChainId(NetworkChainId.POLYGON)
  ];
  tokenPath: IToken[] = [
    this.findTokenById(this.networkPath[0].nativeCurrency.id) as IToken,
    this.findTokenById(this.networkPath[1].nativeCurrency.id) as IToken
  ];

  swapForm: FormGroup<ISwappingForm> = new FormGroup<ISwappingForm>({
    fromAmount: new FormControl<string | null>(null, [Validators.required, Validators.min(0.000001)])
  });

  constructor(
    private dialog: MatDialog,
    private web3loginService: Web3LoginService,
    private store: Store
  ) {}

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

  sendSwapRequest(): void {
    this.swapForm.markAllAsTouched();
    if (this.swapForm.invalid) return;

    const payload: QuotePayload = {
      from: this.tokenPath[0],
      to: this.tokenPath[1],
      amount: this.swapForm.get('fromAmount')?.value as string,
      slippage: '0.5',
      deadline: (Math.floor(Date.now() / 1000) + 60 * 20).toString() // 20 minutes from now
    };

    this.store.dispatch(swapAction({ payload }));
  }

  private handleTokenSelected(tokenId: TokenId, from: boolean): void {
    const token: IToken | undefined = this.findTokenById(tokenId);
    if (!token) return;
    from ? (this.tokenPath[0] = token) : (this.tokenPath[1] = token);
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
  fromAmount: FormControl<string | null>;
}
