import { createAction, props } from '@ngrx/store';
import { ITransactionCard } from '../../../shared/interfaces';

export const localTransactionSentSuccessfully = createAction(
  '[Transaction] Local Transaction Sent Successfully',
  props<{ card: ITransactionCard }>()
);
