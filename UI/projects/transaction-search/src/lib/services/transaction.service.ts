import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ITransactionLog, TransactionOptions, TransactionRole } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  async getTransactions(options: TransactionOptions): Promise<ITransactionLog[]> {
    const latestBlock: bigint = await options.web3.eth.getBlockNumber();
    const { page, limit } = options.pagination;
    const fromBlock: bigint = BigInt(latestBlock) - BigInt(page) * BigInt(limit);
    const transferEventSignature: string = options.web3.utils.sha3(
      'Transfer(address,address,uint256,uint256)'
    ) as string;
    const myAddressPadded: string = options.web3.utils.padLeft(options.address.accountAddress, 64);

    const senderTopics: (string | null)[] = [transferEventSignature, null, myAddressPadded];
    const receiverTopics: (string | null)[] = [transferEventSignature, myAddressPadded, null];

    const [senderLogs, receiverLogs] = await Promise.all([
      this.getTransactionLogs(
        options.web3,
        Number(fromBlock),
        senderTopics as string[],
        TransactionRole.Sender,
        options.address.smartContractAddress
      ),
      this.getTransactionLogs(
        options.web3,
        Number(fromBlock),
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
      const res = await web3.eth.getPastLogs({
        fromBlock,
        address: contractAddress,
        topics
      });

      const processedLogs: ITransactionLog[] = await Promise.all(
        res.map(
          async (
            rec:
              | string
              | {
                  readonly id?: string | undefined;
                  readonly removed?: boolean | undefined;
                  readonly logIndex?: bigint | undefined;
                  readonly transactionIndex?: bigint | undefined;
                  readonly transactionHash?: string | undefined;
                  readonly topics?: string[] | undefined;
                }
          ) => {
            if (typeof rec === 'object' && rec !== null && 'transactionHash' in rec && 'blockNumber' in rec) {
              const transaction = await web3.eth.getTransaction(rec.transactionHash as string);
              const block = await web3.eth.getBlock(rec.blockNumber as number);
              const submittedDate: bigint = block.timestamp;
              const submittedDateFormatted = new Date(Number(submittedDate) * 1000);

              return {
                role,
                transaction,
                block,
                submittedDate: submittedDateFormatted,
                amount: Number(web3.utils.fromWei(transaction.value, 'ether'))
              };
            } else {
              throw new Error('Invalid record object');
            }
          }
        )
      );

      return processedLogs;
    } catch {
      return [];
    }
  }
}
