import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { tokenList } from './../../../../shared/data/tokenList';
import { IToken } from './../../../../shared/interfaces';
import { Store } from '@ngrx/store';
import { lookUpTokenAction } from 'src/app/store/swap-store/state/actions';

@Component({
  selector: 'app-tokens-dialog',
  templateUrl: './tokens-dialog.component.html',
  styleUrls: ['./tokens-dialog.component.scss']
})
export class TokensDialogComponent implements OnInit {
  searchTerm: string = '';
  filteredTokens: IToken[] = [];

  constructor(
    private dialogRef: MatDialogRef<TokensDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITokensDialogData,
    private store: Store
  ) {}

  isSelected(tokenId: string): boolean {
    return this.data.tokenId === tokenId;
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  filterTokens(): void {
    this.applyFilters();
    this.checkAddress();
  }

  private applyFilters(): void {
    this.filteredTokens = tokenList.filter((token: IToken) =>
      token.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    if (this.data.chainIdSelected !== null) {
      this.filteredTokens = this.filteredTokens.filter((token: IToken) =>
        token.networkSupport.some((network) => network.chainId === this.data.chainIdSelected)
      );
    }
  }

  private tokenAddressPatternIsValid(): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(this.searchTerm);
  }

  private checkAddress(): void {
    if (this.tokenAddressPatternIsValid() && !!this.data.chainIdSelected) {
      this.store.dispatch(
        lookUpTokenAction({
          address: this.searchTerm,
          chainId: this.data.chainIdSelected as NetworkChainId,
          tokenIn: true
        })
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
