import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TransactionService } from './transaction.service';
import { transactionLogMock, transactionOptionsMock } from '../../../../../src/app/shared/tests/variables/transactions';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService();
  });

  it('should be created', () => {
    expect(transactionService).toBeTruthy();
  });

  it('should call getTransactionLogs 2 times for sender and receiver when get transactions', async () => {
    const options = transactionOptionsMock;
    const spyOnTransactionLogs = vi.spyOn(transactionService, 'getTransactionLogs')
      .mockResolvedValue([transactionLogMock]);

    await transactionService.getTransactions(options);

    expect(spyOnTransactionLogs).toHaveBeenCalledTimes(2);
  });
});
