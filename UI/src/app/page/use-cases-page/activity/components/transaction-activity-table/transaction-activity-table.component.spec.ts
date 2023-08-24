import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { TransactionActivityTableComponent } from './transaction-activity-table.component';
import { formatServiceMock, web3LoginServiceMock } from '../../../../../shared/tests/services/services.mock';
import { ITransactionLog, TransactionRole } from '@chainbrary/transaction-search';
import { transactionLogMock } from '../../../../../shared/tests/variables/transactions';

describe('TransactionActivityTableComponent', () => {
  const component: TransactionActivityTableComponent = new TransactionActivityTableComponent(
    formatServiceMock,
    web3LoginServiceMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get credited if i\'m the receiver', () => {
    const item: ITransactionLog = transactionLogMock;
    const spyOnGetAmount = vi.spyOn(component, 'getAmount');

    const result = component.getAmount(item);

    expect(spyOnGetAmount).toHaveBeenCalledWith(item);
    expect(result).toBe(`+${2500}`);
  });

  it('should get debited if i\'m the sender', () => {
    const item: ITransactionLog = transactionLogMock;
    item.role = TransactionRole.Sender;

    const result = component.getAmount(item);

    expect(result).toBe(`-${2500}`);
  });
});
