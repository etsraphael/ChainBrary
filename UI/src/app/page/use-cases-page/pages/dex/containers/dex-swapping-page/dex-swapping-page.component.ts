import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail, NetworkChainId, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import {
  INetworkDialogData,
  NetworkDialogComponent
} from './../../../../../../shared/components/modal/network-dialog/network-dialog.component';
import {
  ITokensDialogData,
  TokensDialogComponent
} from './../../../../../../shared/components/modal/tokens-dialog/tokens-dialog.component';
import { tokenList } from './../../../../../../shared/data/tokenList';
import { IToken } from './../../../../../../shared/interfaces';

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

  constructor(
    private dialog: MatDialog,
    private web3loginService: Web3LoginService
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

  private handleTokenSelected(tokenId: TokenId, from: boolean): void {
    const token: IToken | undefined = this.findTokenById(tokenId);
    if (!token) return;
    from ? (this.tokenPath[0] = token) : (this.tokenPath[1] = token);
  }

  private handleNetworkSelected(chainId: NetworkChainId, from: boolean): void {
    // Handle the selected network here
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
