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
    const myAddress = '0xA9ad87470Db27ed18a9a8650f057A7cAab7703Ac';
    const transferEventSignature: string = web3.utils.sha3('Transfer(address,address,uint256,uint256)') as string;
    const myAddressPadded: string = web3.utils.padLeft(myAddress, 64);

    const senderTopics = [transferEventSignature, null, myAddressPadded];
    const receiverTopics = [transferEventSignature, myAddressPadded, null];

    const [senderLogs, receiverLogs] = await Promise.all([
      this.getTransactionLogs(web3, fromBlock, senderTopics as string[], 'As Sender'),
      this.getTransactionLogs(web3, fromBlock, receiverTopics as string[], 'As Receiver')
    ]);

    const allLogs = [...senderLogs, ...receiverLogs];

    console.log('All Logs:', allLogs);
  }

  async getTransactionLogs(web3: Web3, fromBlock: number, topics: string[], role: string): Promise<any[]> {
    try {
      const res = await web3.eth.getPastLogs({
        fromBlock,
        address: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81',
        topics
      });

      const processedLogs = await Promise.all(
        res.map(async (rec) => {
          const transaction = await web3.eth.getTransaction(rec.transactionHash);
          return {
            role,
            transaction,
            valueInEther: web3.utils.fromWei(transaction.value, 'ether')
          };
        })
      );

      return processedLogs;
    } catch (err) {
      console.log('getPastLogs failed', err);
      return [];
    }
  }
}
