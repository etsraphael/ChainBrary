import Web3, { Transaction } from 'web3';

export interface ITransactionLog {
  role: TransactionRole;
  transaction: Transaction;
  block: {
    timestamp: bigint;
  };
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

export interface TransactionOptions {
  web3: Web3;
  pagination: {
    page: number;
    limit: number;
  };
  address: {
    smartContractAddress: string;
    accountAddress: string;
  };
}

export enum TransactionRole {
  Sender = 'As Sender',
  Receiver = 'As Receiver'
}
