import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITransactionsState, TRANSACTION_FEATURE_KEY } from './interfaces';

export const selectTransactions = createFeatureSelector<ITransactionsState>(TRANSACTION_FEATURE_KEY);

export const selectRecentTransactions = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.recentTransactions
);
