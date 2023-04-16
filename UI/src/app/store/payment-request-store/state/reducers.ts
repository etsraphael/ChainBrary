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
      },
      profile: {
        publicAddress: paymentRequest.publicAddress,
        avatarUrl: paymentRequest.avatarUrl,
        username: paymentRequest.username,
        subtitle: paymentRequest.subtitle
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
  )
);

export function reducer(state: IPaymentRequestState = initialState, action: Action): IPaymentRequestState {
  return authReducer(state, action);
}
