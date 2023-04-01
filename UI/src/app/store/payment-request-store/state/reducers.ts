import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as AuthActions from './actions';
import { initialState } from './init';
import { IPaymentRequestState } from './interfaces';

export const authReducer: ActionReducer<IPaymentRequestState, Action> = createReducer(
  initialState,
  on(
    AuthActions.generatePaymentRequest,
    (state): IPaymentRequestState => ({
      ...state,
      payment: {
        ...state.payment,
        error: null,
        loading: true
      }
    })
  ),
  on(
    AuthActions.generatePaymentRequestSuccess,
    (state, { paymentRequest }): IPaymentRequestState => ({
      ...state,
      payment: {
        error: null,
        loading: false,
        data: paymentRequest
      }
    })
  ),
  on(
    AuthActions.generatePaymentRequestFailure,
    (state, { errorMessage }): IPaymentRequestState => ({
      ...state,
      payment: {
        error: errorMessage,
        loading: false,
        data: null
      }
    })
  ),
  on(
    AuthActions.loadVerifiedAccount,
    (state): IPaymentRequestState => ({
      ...state,
      userAccount: {
        ...state.userAccount,
        error: null,
        loading: true
      }
    })
  ),
  on(
    AuthActions.loadVerifiedAccountSuccess,
    (state, { verifiedAccount }): IPaymentRequestState => ({
      ...state,
      verifiedAccount: true,
      userAccount: {
        error: null,
        loading: false,
        data: verifiedAccount
      }
    })
  ),
  on(
    AuthActions.loadVerifiedAccountFailure,
    (state, { errorMessage }): IPaymentRequestState => ({
      ...state,
      verifiedAccount: false,
      userAccount: {
        error: errorMessage,
        loading: false,
        data: null
      }
    })
  )
);

export function reducer(state: IPaymentRequestState = initialState, action: Action): IPaymentRequestState {
  return authReducer(state, action);
}
