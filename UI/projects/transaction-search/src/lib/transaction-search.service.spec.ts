import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TransactionSearchService } from './transaction-search.service';
import { TransactionService } from './services/transaction.service';
import { transactionLogMock, transactionOptionsMock } from '../../../../src/app/shared/tests/variables/transactions';

describe('TransactionSearchService', () => {
  let transactionSearchService: TransactionSearchService;
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService();
    transactionSearchService = new TransactionSearchService(transactionService);
  });

  it('should be created', () => {
    expect(transactionSearchService).toBeTruthy();
  });

  it('should call getTransactions for retrieve transactions infos', async () => {
    const options = transactionOptionsMock;
    const spyOnTransactions = vi.spyOn(transactionService, 'getTransactions')
      .mockResolvedValue([transactionLogMock]);

    await transactionSearchService.getTransactions(options);

    expect(spyOnTransactions).toHaveBeenCalled();
  });
});
