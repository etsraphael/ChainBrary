import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { tokenList } from './../../../../shared/data/tokenList';
import { IToken } from './../../../../shared/interfaces';

@Component({
  selector: 'app-tokens-dialog',
  templateUrl: './tokens-dialog.component.html',
  styleUrls: ['./tokens-dialog.component.scss']
})
export class TokensDialogComponent implements OnInit {
  searchTerm: string = '';
  tokenList: IToken[] = tokenList;
  filteredTokens: IToken[] = [];

  constructor(
    private dialogRef: MatDialogRef<TokensDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITokensDialogData
  ) {}

  isSelected(tokenId: string): boolean {
    return this.data.tokenId === tokenId;
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  filterTokens(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredTokens = this.tokenList.filter((token: IToken) =>
      token.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    if (this.data.chainIdSelected !== null) {
      this.filteredTokens = this.filteredTokens.filter((token: IToken) =>
        token.networkSupport.some((network) => network.chainId === this.data.chainIdSelected)
      );
    }
  }

  tokenSelected(tokenId: TokenId | string): void {
    return this.dialogRef.close(tokenId);
  }
}

export interface ITokensDialogData {
  chainIdSelected: NetworkChainId | null;
  tokenId: string | null;
}
