import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tokens-dialog',
  templateUrl: './tokens-dialog.component.html',
  styleUrl: './tokens-dialog.component.scss'
})
export class TokensDialogComponent implements OnInit {
  searchTerm: string = '';
  // TODO: Replace any[] with the correct type
  tokenList: any[] = [
    { name: 'Tether USD', symbol: 'USDT' },
    { name: 'USD Coin', symbol: 'USDC' },
    { name: 'Wrapped ETH', symbol: 'WETH' },
    { name: 'Ethereum Token', symbol: 'ETH' },
    { name: 'Flourishing AI', symbol: 'AI' },
    { name: 'AltLayer Token', symbol: 'ALT' },
    { name: 'Animal Concerts Token', symbol: 'ANML' }
  ];
  filteredTokens: any[] = [];   // TODO: Replace any[] with the correct type

  constructor(
    private dialogRef: MatDialogRef<TokensDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any   // TODO: Replace any with the correct type

  ) {}

  ngOnInit(): void {
    this.filteredTokens = this.tokenList;
  }

  filterTokens(): void {
    this.filteredTokens = this.tokenList.filter((token) =>
      token.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  tokenSelected(tokenSymbol: string): void {
    this.dialogRef.close(tokenSymbol);
  }
}
