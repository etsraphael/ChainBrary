import { createFeatureSelector, createSelector } from '@ngrx/store';
import { transactionAdapter } from './init';
import { ITransactionsState, TRANSACTION_FEATURE_KEY } from './interfaces';

export const selectTransactions = createFeatureSelector<ITransactionsState>(TRANSACTION_FEATURE_KEY);

export const selectRecentTransactionsState = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.recentTransactions
);

export const selectRecentTransactionsByComponent = (component: string) => {
  return createSelector(selectTransactions, (state: ITransactionsState) =>
    transactionAdapter
      .getSelectors()
      .selectAll(state.recentTransactions)
      .filter((transaction) => transaction.component === component)
  );
};
