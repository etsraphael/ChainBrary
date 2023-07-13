import { Component, OnInit } from '@angular/core';
import { ITransactionLog, TransactionOptions, TransactionSearchService } from '@chainbrary/transaction-search';
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
      const options: TransactionOptions = {
        web3: new Web3(window.ethereum),
        pagination: {
          page: 1,
          limit: 1000000
        },
        address: {
          smartContractAddress: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81',
          accountAddress: '0xA9ad87470Db27ed18a9a8650f057A7cAab7703Ac'
        }
      };

      this.transactionSearchService.getTransactions(options).then((res: ITransactionLog[]) => {
        console.log('res', res);
      });
    }, 2000);
  }
}
