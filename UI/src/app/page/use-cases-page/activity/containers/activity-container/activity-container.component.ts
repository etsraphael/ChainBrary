import { Component, OnInit } from '@angular/core';
import { ITransactionLog } from '@chainbrary/transaction-search';
import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
export class ActivityContainerComponent implements OnInit {
  transactions$: Observable<ITransactionLog[]>;
  transactionsIsLoading$: Observable<boolean>;
  currentNetwork$: Observable<INetworkDetail | null>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.generateObs();
    this.callActions();
  }

  generateObs(): void {
    this.transactions$ = this.store.select(selectHistoricalTransactions);
    this.currentNetwork$ = this.store.select(selectCurrentNetwork);
    this.transactionsIsLoading$ = this.store.select(selectHistoricalTransactionsIsLoading);
  }

  callActions(): void {
    this.store.dispatch(
      loadTransactionsFromBridgeTransfer({ chainId: NetworkChainId.SEPOLIA, page: 1, limit: 1000000 })
    );
  }
}
