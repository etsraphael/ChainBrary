import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Observable, Subscription, map, take } from 'rxjs';
import { StoreState, Vault } from './../../../../shared/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-withdraw-token-card[vaultObs]',
  templateUrl: './withdraw-token-card.component.html',
  styleUrls: ['./withdraw-token-card.component.scss']
})
export class WithdrawTokenCardComponent {
  @Input() vaultObs: Observable<StoreState<Vault | null> | null>;
  @Output() withdrawToken = new EventEmitter<void>();

  get vaultData$(): Observable<Vault | null> {
    return this.vaultObs.pipe(map((vault: StoreState<Vault | null> | null) => vault?.data || null));
  }

  get vaultIsLoading$(): Observable<boolean> {
    return this.vaultObs.pipe(map((vault: StoreState<Vault | null> | null) => vault?.loading === true));
  }

  get networkDetail$(): Observable<INetworkDetail | null> {
    return this.vaultData$.pipe(map((vault: Vault | null) => vault?.network.networkDetail || null));
  }

  get networkShareToken$(): Observable<string> {
    return this.vaultData$.pipe(
      map((vault: Vault | null) => {
        const { userStaked, TVS } = vault?.data ?? {};
        if (userStaked === undefined || userStaked === 0 || TVS === undefined || TVS === 0) {
          return '0 %';
        }
        return `${((userStaked / TVS) * 100).toFixed(2)} %`;
      })
    );
  }

  get totalAmount$(): Observable<number> {
    return this.vaultData$.pipe(
      map((vault: Vault | null) => {
        const { userStaked, userReward } = vault?.data ?? {};
        return (userStaked || 0) + (userReward || 0);
      })
    );
  }

  constructor(private snackbar: MatSnackBar) {}

  withdrawTokenClicked(): Subscription {
    return this.totalAmount$.pipe(take(1)).subscribe((amount) => {
      if (amount === 0) {
        this.snackbar.open('Insufficient balance', '', {
          duration: 3000
        });
        return;
      }
      return this.withdrawToken.emit();
    });
  }
}
