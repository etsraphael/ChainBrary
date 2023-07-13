import { EntityState } from '@ngrx/entity';
import { ITransactionCard } from '../../../shared/interfaces';
import { ITransactionLog } from '@chainbrary/transaction-search';

export const TRANSACTION_FEATURE_KEY = 'transactions';

export interface ITransactionsState {
  recentTransactions: EntityState<ITransactionCard>;
  historicalTransactions: EntityState<ITransactionLog>;
}

export interface TransactionsState {
  readonly [TRANSACTION_FEATURE_KEY]: ITransactionsState;
}
