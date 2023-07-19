import { ITransactionLog } from '@chainbrary/transaction-search';
import { createAction, props } from '@ngrx/store';
import { ITransactionCard } from '../../../shared/interfaces';

export const localTransactionSentSuccessfully = createAction(
  '[Transaction] Local Transaction Sent Successfully',
  props<{ card: ITransactionCard }>()
);

export const loadTransactionsFromBridgeTransfer = createAction(
  '[Transaction] Load Transactions From Bridge Transfer',
  props<{ page: number; limit: number }>()
);

export const loadTransactionsFromBridgeTransferSuccess = createAction(
  '[Transaction] Load Transactions From Bridge Transfer Success',
  props<{ list: ITransactionLog[] }>()
);

export const loadTransactionsFromBridgeTransferFailure = createAction(
  '[Transaction] Load Transactions From Bridge Transfer Failure',
  props<{ error: string }>()
);
