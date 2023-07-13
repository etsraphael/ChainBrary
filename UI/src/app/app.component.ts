import { Component, OnInit } from '@angular/core';
import { ITransactionLog, TransactionSearchService } from '@chainbrary/transaction-search';
import Web3 from 'web3';
import { AnalyticsService } from './shared/services/analytics/analytics.service';

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
  constructor(private analyticsService: AnalyticsService, private transactionSearchService: TransactionSearchService) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();

    setTimeout(() => {
      this.transactionSearchService
        .getTransactions(new Web3(window.ethereum), 1, 1000000, '0xA9ad87470Db27ed18a9a8650f057A7cAab7703Ac')
        .then((res: ITransactionLog[]) => {
          console.log('res', res);
        });
    }, 2000);
  }
}
