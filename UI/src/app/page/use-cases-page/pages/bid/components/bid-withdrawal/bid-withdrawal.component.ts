import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, filter, map, take } from 'rxjs';
import { selectCurrentNetwork } from './../../../../../../store/auth-store/state/selectors';
import { requestWithdraw } from './../../../../../../store/bid-store/state/actions';
import { selectHighestBid } from './../../../../../../store/bid-store/state/selectors';

@Component({
  selector: 'app-bid-withdrawal',
  templateUrl: './bid-withdrawal.component.html',
  styleUrls: ['./bid-withdrawal.component.scss']
})
export class BidWithdrawalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<BidWithdrawalComponent>,
    private readonly store: Store
  ) {}

  highestBid$: Observable<number | null> = this.store.select(selectHighestBid);
  currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  bidResult: IBidWithdrawalAmount;

  ngOnInit(): void {
    this.highestBid$
      .pipe(
        filter((highestBid: number | null) => highestBid !== null),
        map((highestBid: number | null) => highestBid as number),
        take(1)
      )
      .subscribe((highestBid: number) => {
        this.bidResult = {
          total: highestBid,
          fee: highestBid * 0.001,
          net: highestBid - highestBid * 0.001
        };
      });
  }

  submit(): void {
    this.store.dispatch(requestWithdraw());
    return this.closeModal();
  }

  closeModal(): void {
    return this.dialogRef.close();
  }
}

export interface IBidWithdrawalAmount {
  total: number;
  fee: number;
  net: number;
}
