import { EntityState } from '@ngrx/entity';
import { ITransactionCard } from '../../../shared/interfaces';

export const TRANSACTION_FEATURE_KEY = 'transactions';

export interface ITransactionsState {
  recentTransactions: EntityState<ITransactionCard>;
}

export interface TransactionsState {
  readonly [TRANSACTION_FEATURE_KEY]: ITransactionsState;
}
