import { ITransactionLog } from '@chainbrary/transaction-search';
import { EntityState } from '@ngrx/entity';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { ITransactionCard } from './../../../shared/interfaces';
import { historicalTransactionAdapter, transactionAdapter } from './init';
import { ITransactionsState, TRANSACTION_FEATURE_KEY } from './interfaces';

export const selectTransactions = createFeatureSelector<ITransactionsState>(TRANSACTION_FEATURE_KEY);

export const selectRecentTransactionsState: MemoizedSelector<object, EntityState<ITransactionCard>> = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.recentTransactions
);

export const selectHistoricalTransactionsState: MemoizedSelector<object, EntityState<ITransactionLog>> = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.historicalTransactions.data
);

export const selectHistoricalTransactions: MemoizedSelector<object, ITransactionLog[]> = createSelector(
  selectTransactions,
  (state: ITransactionsState) =>
    historicalTransactionAdapter.getSelectors().selectAll(state.historicalTransactions.data)
);

export const selectHistoricalTransactionsIsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.historicalTransactions.loading
);

export const selectRecentTransactionsByComponent = (component: string) => {
  return createSelector(selectTransactions, (state: ITransactionsState) =>
    transactionAdapter
      .getSelectors()
      .selectAll(state.recentTransactions)
      .filter((transaction) => transaction.component === component)
  );
};
