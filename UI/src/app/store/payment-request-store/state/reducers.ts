import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as PaymentActions from './actions';
import { initialState } from './init';
import { IPaymentRequestState } from './interfaces';

export const authReducer: ActionReducer<IPaymentRequestState, Action> = createReducer(
  initialState,
  on(
    PaymentActions.generatePaymentRequest,
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
    PaymentActions.generatePaymentRequestSuccess,
    (state, { paymentRequest, network }): IPaymentRequestState => ({
      ...state,
      payment: {
        error: null,
        loading: false,
        data: paymentRequest
      },
      profile: {
        publicAddress: paymentRequest.publicAddress,
        avatarUrl: paymentRequest.avatarUrl,
        username: paymentRequest.username
      },
      network
    })
  ),
  on(
    PaymentActions.generatePaymentRequestFailure,
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
    PaymentActions.sendAmount,
    (state): IPaymentRequestState => ({
      ...state,
      payment: {
        ...state.payment,
        loading: true,
        error: null
      }
    })
  ),
  on(
    PaymentActions.amountSent,
    PaymentActions.amountSentFailure,
    (state): IPaymentRequestState => ({
      ...state,
      payment: {
        ...state.payment,
        loading: false,
        error: null
      }
    })
  ),
  on(
    PaymentActions.selectToken,
    (state, { token }): IPaymentRequestState => ({
      ...state,
      token
    })
  ),
  on(
    PaymentActions.applyConversionToken,
    (state): IPaymentRequestState => ({
      ...state,
      conversion: {
        ...state.conversion,
        loading: true,
        error: null
      }
    })
  ),
  on(
    PaymentActions.applyConversionTokenSuccess,
    (state, { amount }): IPaymentRequestState => ({
      ...state,
      conversion: {
        loading: false,
        error: null,
        data: {
          ...state.conversion.data,
          usdAmount: amount
        }
      }
    })
  ),
  on(
    PaymentActions.applyConversionTokenFailure,
    (state, { errorMessage }): IPaymentRequestState => ({
      ...state,
      conversion: {
        ...state.conversion,
        loading: false,
        error: errorMessage
      }
    })
  )
);

export function reducer(state: IPaymentRequestState = initialState, action: Action): IPaymentRequestState {
  return authReducer(state, action);
}
