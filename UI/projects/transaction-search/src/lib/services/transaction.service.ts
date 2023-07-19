import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ITransactionLog, ITransactionPayload, TransactionOptions, TransactionRole } from '../models/transaction.model';
import { Transaction, BlockTransactionString } from 'web3-eth';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  async getTransactions(options: TransactionOptions): Promise<ITransactionLog[]> {
    const latestBlock: number = await options.web3.eth.getBlockNumber();
    const { page, limit } = options.pagination;
    const fromBlock: number = latestBlock - page * limit;
    const transferEventSignature: string = options.web3.utils.sha3(
      'Transfer(address,address,uint256,uint256)'
    ) as string;
    const myAddressPadded: string = options.web3.utils.padLeft(options.address.accountAddress, 64);

    const senderTopics: (string | null)[] = [transferEventSignature, null, myAddressPadded];
    const receiverTopics: (string | null)[] = [transferEventSignature, myAddressPadded, null];

    const [senderLogs, receiverLogs] = await Promise.all([
      this.getTransactionLogs(
        options.web3,
        fromBlock,
        senderTopics as string[],
        TransactionRole.Sender,
        options.address.smartContractAddress
      ),
      this.getTransactionLogs(
        options.web3,
        fromBlock,
        receiverTopics as string[],
        TransactionRole.Receiver,
        options.address.smartContractAddress
      )
    ]);

    const allLogs: ITransactionLog[] = [...senderLogs, ...receiverLogs];
    const sortedLogs: ITransactionLog[] = allLogs.sort((a, b) => b.submittedDate.getTime() - a.submittedDate.getTime());

    return sortedLogs;
  }

  async getTransactionLogs(
    web3: Web3,
    fromBlock: number,
    topics: string[],
    role: TransactionRole,
    contractAddress: string
  ): Promise<ITransactionLog[]> {
    try {
      const res: ITransactionPayload[] = await web3.eth.getPastLogs({
        fromBlock,
        address: contractAddress,
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
