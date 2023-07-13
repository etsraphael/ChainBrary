import { Transaction, BlockTransactionString } from 'web3-eth';

export interface ITransactionLog {
  role: TransactionRole;
  transaction: Transaction;
  block: BlockTransactionString;
  submittedDate: Date;
  amount: number;
}

export interface ITransactionPayload {
  address: string;
  data: string;
  topics: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  removed: boolean;
}

export enum TransactionRole {
  Sender = 'As Sender',
  Receiver = 'As Receiver'
}
