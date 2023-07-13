import { Component, OnInit } from '@angular/core';
import { TransactionSearchService } from '@chainbrary/transaction-search';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { AnalyticsService } from './shared/services/analytics/analytics.service';
import { loadTransactionsFromBridgeTransfer } from './store/transaction-store/state/actions';

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
  constructor(
    private analyticsService: AnalyticsService,
    private transactionSearchService: TransactionSearchService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();

    setTimeout(() => {
      this.store.dispatch(loadTransactionsFromBridgeTransfer({ chainId: NetworkChainId.SEPOLIA, page: 1, limit: 1000000 }))
    }, 2000);
  }
}
