import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ITransactionLog, ITransactionPayload, TransactionRole } from '../models/transaction.model';
import { Transaction, BlockTransactionString } from 'web3-eth';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  async getTransactions(web3: Web3, page: number, limit: number, address: string): Promise<ITransactionLog[]> {
    const latestBlock: number = await web3.eth.getBlockNumber();
    const fromBlock: number = latestBlock - page * limit;
    const transferEventSignature: string = web3.utils.sha3('Transfer(address,address,uint256,uint256)') as string;
    const myAddressPadded: string = web3.utils.padLeft(address, 64);

    const senderTopics: (string | null)[] = [transferEventSignature, null, myAddressPadded];
    const receiverTopics: (string | null)[] = [transferEventSignature, myAddressPadded, null];

    const [senderLogs, receiverLogs] = await Promise.all([
      this.getTransactionLogs(web3, fromBlock, senderTopics as string[], TransactionRole.Sender),
      this.getTransactionLogs(web3, fromBlock, receiverTopics as string[], TransactionRole.Receiver)
    ]);

    const allLogs: ITransactionLog[] = [...senderLogs, ...receiverLogs];
    const sortedLogs: ITransactionLog[] = allLogs.sort((a, b) => b.submittedDate.getTime() - a.submittedDate.getTime());

    return sortedLogs;
  }

  async getTransactionLogs(
    web3: Web3,
    fromBlock: number,
    topics: string[],
    role: TransactionRole
  ): Promise<ITransactionLog[]> {
    try {
      const res: ITransactionPayload[] = await web3.eth.getPastLogs({
        fromBlock,
        address: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81',
        topics
      });

      const processedLogs: ITransactionLog[] = await Promise.all(
        res.map(async (rec: ITransactionPayload) => {
          const transaction: Transaction = await web3.eth.getTransaction(rec.transactionHash);
          const block: BlockTransactionString = await web3.eth.getBlock(rec.blockNumber);
          const submittedDate: string | number = (await web3.eth.getBlock(rec.blockNumber)).timestamp;
          const submittedDateFormatted = new Date((submittedDate as number) * 1000);

          return {
            role,
            transaction,
            block,
            submittedDate: submittedDateFormatted,
            amount: Number(web3.utils.fromWei(transaction.value, 'ether'))
          };
        })
      );

      return processedLogs;
    } catch {
      return [];
    }
  }
}
