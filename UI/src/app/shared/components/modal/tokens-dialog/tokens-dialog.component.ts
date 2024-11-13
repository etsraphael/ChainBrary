import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { filter, map, Observable, ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { tokenList } from './../../../../shared/data/tokenList';
import { IToken, StoreState } from './../../../../shared/interfaces';
import { lookUpTokenAction } from './../../../../store/swap-store/state/actions';

@Component({
  selector: 'app-tokens-dialog',
  templateUrl: './tokens-dialog.component.html',
  styleUrls: ['./tokens-dialog.component.scss']
})
export class TokensDialogComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  filteredTokens: IToken[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private dialogRef: MatDialogRef<TokensDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITokensDialogData,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.applyFilters();
    this.catchTokenSearch();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  isSelected(tokenId: string): boolean {
    return this.data.tokenId === tokenId;
  }

  filterTokens(): void {
    this.applyFilters();
    this.checkAddress();
  }

  tokenSelected(token: IToken): void {
    return this.dialogRef.close(token);
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

  private catchTokenSearch(): Subscription {
    return this.data.tokenSearch$
      .pipe(
        takeUntil(this.destroyed$),
        filter((storeState: StoreState<IToken | null>) => !!storeState.data),
        map((storeState: StoreState<IToken | null>) => storeState.data)
      )
      .subscribe((token: IToken | null) => {
        if (token && !this.filteredTokens.includes(token)) {
          this.filteredTokens.push(token);
        }
      });
  }
}

export interface ITokensDialogData {
  chainIdSelected: NetworkChainId | null;
  tokenId: string | null;
  tokenSearch$: Observable<StoreState<IToken | null>>;
}
