import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  async getTransactions(web3: Web3, page: number, limit: number, address: string): Promise<any[]> {
    const latestBlock: number = await web3.eth.getBlockNumber();
    const fromBlock: number = latestBlock - page * limit;
    const transferEventSignature: string = web3.utils.sha3('Transfer(address,address,uint256,uint256)') as string;
    const myAddressPadded: string = web3.utils.padLeft(address, 64);

    const senderTopics = [transferEventSignature, null, myAddressPadded];
    const receiverTopics = [transferEventSignature, myAddressPadded, null];

    const [senderLogs, receiverLogs] = await Promise.all([
      this.getTransactionLogs(web3, fromBlock, senderTopics as string[], 'As Sender'),
      this.getTransactionLogs(web3, fromBlock, receiverTopics as string[], 'As Receiver')
    ]);

    const allLogs = [...senderLogs, ...receiverLogs];
    const sortedLogs = allLogs.sort((a, b) => b.date - a.date);

    return sortedLogs;
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
          const test = (await web3.eth.getBlock(rec.blockNumber)).timestamp;
          const date = new Date((test as number) * 1000);
          console.log(rec);

          return {
            role,
            transaction,
            valueInEther: web3.utils.fromWei(transaction.value, 'ether'),
            date
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
