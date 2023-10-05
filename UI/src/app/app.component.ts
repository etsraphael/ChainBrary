import { Component, OnInit } from '@angular/core';
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
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();

    // // TODO: delete this code
    // console.log('starting')
    // // test web3 connection to http://localhost:7545
    // const web3 = new Web3('http://localhost:7545');

    // // get balance of 0x641875Aef816aF684b714eC24D0670EBa326e140 address
    // web3.eth.getBalance('0x4d99C0d9aB90fa33B51Db0deF06124b8708F9681').then((balance)=> {
    //   console.log('balance: ', balance)
    // });

    // web3.eth.getAccounts().then(accounts => {
    //   const balancePromises = accounts.map(account =>
    //     web3.eth.getBalance(account).then(balance => ({ account, balance: parseFloat(web3.utils.fromWei(balance, 'ether')) }))
    //   );

    //   Promise.all(balancePromises).then(balances => {
    //     balances.sort((a, b) => b.balance - a.balance); // Sort by balance, descending
    //     const top10 = balances.slice(0, 10); // Get top 10
    //     console.log('Top 10 addresses:', top10);
    //   });
    // });
  }
}
