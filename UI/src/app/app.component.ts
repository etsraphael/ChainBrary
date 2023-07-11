import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './shared/services/analytics/analytics.service';
import Web3 from 'web3';

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
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();

    setTimeout(() => {
      this.getTransaction(1, 1000000);
    }, 3000);
  }

  async getTransaction(page: number, limit: number): Promise<void> {
    const web3: Web3 = new Web3(window.ethereum);
    const latestBlock: number = await web3.eth.getBlockNumber();
    const fromBlock: number = latestBlock - page * limit;

    web3.eth
      .getPastLogs({ fromBlock, address: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81' })
      .then((res) => {
        console.log(res);
        res.forEach((rec) => {
          web3.eth.getTransaction(rec.transactionHash).then((transaction) => {
            console.log('Value:', web3.utils.fromWei(transaction.value, 'ether'), 'ETH');
          });
        });
      })
      .catch((err) => console.log('getPastLogs failed', err));
  }

}
