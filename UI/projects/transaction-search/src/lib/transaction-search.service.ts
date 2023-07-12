import { Injectable } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class TransactionSearchService {
  constructor(private transactionService: TransactionService) {}

  async getTransactions(web3: Web3, page: number, limit: number, address: string): Promise<any[]> {
    return this.transactionService.getTransactions(web3, page, limit, address);
  }
}
