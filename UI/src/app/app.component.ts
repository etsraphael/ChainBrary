import { Component, OnInit } from '@angular/core';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { AnalyticsService } from './shared/services/analytics/analytics.service';
import { loadTransactionsFromBridgeTransfer } from './store/transaction-store/state/actions';
import { Observable } from 'rxjs';
import { ITransactionLog } from '@chainbrary/transaction-search';
import { selectHistoricalTransactions } from './store/transaction-store/state/selectors';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // TODO: Remove this when page is created
  transactions$: Observable<ITransactionLog[]>;

  constructor(private analyticsService: AnalyticsService, private store: Store) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();

    this.transactions$ = this.store.select(selectHistoricalTransactions);

    this.transactions$.subscribe((transactions) => {
      console.log('transactions', transactions);
    });

    setTimeout(() => {
      this.store.dispatch(
        loadTransactionsFromBridgeTransfer({ chainId: NetworkChainId.SEPOLIA, page: 1, limit: 1000000 })
      );
    }, 2000);
  }
}
