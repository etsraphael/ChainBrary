import { ITransactionLog } from '@chainbrary/transaction-search';
import { EntityState } from '@ngrx/entity';
import { ITransactionCard, StoreState } from '../../../shared/interfaces';

export const TRANSACTION_FEATURE_KEY = 'transactions';

export interface ITransactionsState {
  recentTransactions: EntityState<ITransactionCard>;
  historicalTransactions: StoreState<EntityState<ITransactionLog>>;
}

export interface TransactionsState {
  readonly [TRANSACTION_FEATURE_KEY]: ITransactionsState;
}
