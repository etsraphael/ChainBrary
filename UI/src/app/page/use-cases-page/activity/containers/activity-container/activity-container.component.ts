import { Component, OnInit } from '@angular/core';
import { ITransactionLog } from '@chainbrary/transaction-search';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadTransactionsFromBridgeTransfer } from './../../../../../store/transaction-store/state/actions';
import { selectHistoricalTransactions } from './../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.scss']
})
export class ActivityContainerComponent implements OnInit {
  transactions$: Observable<ITransactionLog[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.generateObs();
    this.callActions();
  }

  generateObs(): void {
    this.transactions$ = this.store.select(selectHistoricalTransactions);
    this.transactions$.subscribe(console.log);
  }

  callActions(): void {
    this.store.dispatch(
      loadTransactionsFromBridgeTransfer({ chainId: NetworkChainId.SEPOLIA, page: 1, limit: 1000000 })
    );
  }
}
