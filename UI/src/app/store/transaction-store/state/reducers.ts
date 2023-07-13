import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as TransactionActions from './actions';
import { historicalTransactionAdapter, initialState, transactionAdapter } from './init';
import { ITransactionsState } from './interfaces';

export const transactionReducer: ActionReducer<ITransactionsState, Action> = createReducer(
  initialState,
  on(
    TransactionActions.localTransactionSentSuccessfully,
    (state, { card }): ITransactionsState => ({
      ...state,
      recentTransactions: transactionAdapter.addOne(card, state.recentTransactions)
    })
  ),
  on(
    TransactionActions.loadTransactionsFromBridgeTransfer,
    (state): ITransactionsState => ({
      ...state,
      historicalTransactions: {
        ...state.historicalTransactions,
        loading: true,
        error: null
      }
    })
  ),
  on(
    TransactionActions.loadTransactionsFromBridgeTransferSuccess,
    (state, { list }): ITransactionsState => ({
      ...state,
      historicalTransactions: {
        loading: false,
        error: null,
        data: historicalTransactionAdapter.addMany(list, state.historicalTransactions.data)
      }
    })
  ),
  on(
    TransactionActions.loadTransactionsFromBridgeTransferFailure,
    (state, { error }): ITransactionsState => ({
      ...state,
      historicalTransactions: {
        ...state.historicalTransactions,
        loading: false,
        error
      }
    })
  )
);

export function reducer(state: ITransactionsState = initialState, action: Action): ITransactionsState {
  return transactionReducer(state, action);
}
