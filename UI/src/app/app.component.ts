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


    // TODO: delete this code
    // console.log('starting')
    // // test web3 connection to http://localhost:7545
    // const web3 = new Web3('http://localhost:7545');

    // // get balance of 0x641875Aef816aF684b714eC24D0670EBa326e140 address
    // web3.eth.getBalance('0xCB2E3f10B09379Afe128078cd8A938AE3234ddef').then((balance)=> {
    //   console.log('balance: ', balance)
    // });
  }
}
