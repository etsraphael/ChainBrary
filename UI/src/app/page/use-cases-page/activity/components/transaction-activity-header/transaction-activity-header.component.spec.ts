import { describe, expect, it } from 'vitest';
import { TransactionActivityHeaderComponent } from './transaction-activity-header.component';

describe('TransactionActivityHeaderComponent', () => {
  const component: TransactionActivityHeaderComponent = new TransactionActivityHeaderComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
