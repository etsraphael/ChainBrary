import { Action, ActionReducer, createReducer } from '@ngrx/store';
import { initialState } from './init';
import { IPaymentRequestState } from './interfaces';

export const authReducer: ActionReducer<IPaymentRequestState, Action> = createReducer(initialState);

export function reducer(state: IPaymentRequestState = initialState, action: Action): IPaymentRequestState {
  return authReducer(state, action);
}
