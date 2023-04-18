import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as TransactionActions from './actions';
import { initialState, transactionAdapter } from './init';
import { ITransactionsState } from './interfaces';

export const transactionReducer: ActionReducer<ITransactionsState, Action> = createReducer(
  initialState,
  on(
    TransactionActions.localTransactionSentSuccessfully,
    (state, { card }): ITransactionsState => ({
      ...state,
      recentTransactions: transactionAdapter.addOne(card, state.recentTransactions)
    })
  )
);

export function reducer(state: ITransactionsState = initialState, action: Action): ITransactionsState {
  return transactionReducer(state, action);
}
