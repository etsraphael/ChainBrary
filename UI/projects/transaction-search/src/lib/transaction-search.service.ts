import { Injectable } from '@angular/core';
import { ITransactionLog, TransactionOptions } from './models';
import { TransactionService } from './services/transaction.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionSearchService {
  constructor(private transactionService: TransactionService) {}

  async getTransactions(options: TransactionOptions): Promise<ITransactionLog[]> {
    return this.transactionService.getTransactions(options);
  }
}
