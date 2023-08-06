import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { TransactionActivityTableComponent } from './transaction-activity-table.component';
import { formatServiceMock, web3LoginServiceMock } from 'src/app/shared/tests/services/services.mock';
import { ITransactionLog, TransactionRole } from '@chainbrary/transaction-search';
import { transactionLogMock } from 'src/app/shared/tests/variables/variables.mock';

describe('TransactionActivityTableComponent', () => {
  const component: TransactionActivityTableComponent = new TransactionActivityTableComponent(
    formatServiceMock,
    web3LoginServiceMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get credited if i\'m the receiver', () => {
    const itemMock: ITransactionLog = transactionLogMock;
    const spyGetAmount = vi.spyOn(component, 'getAmount');
    const result = component.getAmount(itemMock);

    expect(spyGetAmount).toHaveBeenCalledWith(itemMock);
    expect(result).toBe(`+${2500}`);
  });

  it('should get debited if i\'m the sender', () => {
    const itemMock: ITransactionLog = transactionLogMock;
    itemMock.role = TransactionRole.Sender;
    const result = component.getAmount(itemMock);

    expect(result).toBe(`-${2500}`);
  });
});
