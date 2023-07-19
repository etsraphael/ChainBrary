import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITransactionLog } from '@chainbrary/transaction-search';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription, distinctUntilChanged, filter, skip } from 'rxjs';
import { selectCurrentNetwork } from './../../../../../store/auth-store/state/selectors';
import { loadTransactionsFromBridgeTransfer } from './../../../../../store/transaction-store/state/actions';
import {
  selectHistoricalTransactions,
  selectHistoricalTransactionsIsLoading
} from './../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.scss']
})
export class ActivityContainerComponent implements OnInit, OnDestroy {
  transactions$: Observable<ITransactionLog[]>;
  transactionsIsLoading$: Observable<boolean>;
  currentNetwork$: Observable<INetworkDetail | null>;
  currentNetworkSub: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.generateObs();
    this.callActions();
    this.generateSubs();
  }

  generateObs(): void {
    this.transactions$ = this.store.select(selectHistoricalTransactions);
    this.currentNetwork$ = this.store.select(selectCurrentNetwork);
    this.transactionsIsLoading$ = this.store.select(selectHistoricalTransactionsIsLoading);
  }

  callActions(): void {
    this.store.dispatch(loadTransactionsFromBridgeTransfer({ page: 1, limit: 1000000 }));
  }

  // call list of transactions after network changes
  generateSubs(): void {
    this.currentNetworkSub = this.currentNetwork$
      .pipe(
        distinctUntilChanged(),
        filter((network) => network !== null),
        skip(1)
      )
      .subscribe(() => this.callActions());
  }

  ngOnDestroy(): void {
    this.currentNetworkSub?.unsubscribe();
  }
}
