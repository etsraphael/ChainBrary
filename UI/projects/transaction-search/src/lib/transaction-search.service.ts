import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ITransactionLog } from './models';
import { TransactionService } from './services/transaction.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionSearchService {
  constructor(private transactionService: TransactionService) {}

  async getTransactions(web3: Web3, page: number, limit: number, address: string): Promise<ITransactionLog[]> {
    return this.transactionService.getTransactions(web3, page, limit, address);
  }
}
