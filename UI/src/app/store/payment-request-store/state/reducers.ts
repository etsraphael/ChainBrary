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
    (state, { paymentRequest, network, token }): IPaymentRequestState => ({
      ...state,
      payment: {
        error: null,
        loading: false,
        data: paymentRequest
      },
      profile: {
        publicAddress: paymentRequest.publicAddress,
        avatarUrl: paymentRequest.avatarUrl ? paymentRequest.avatarUrl : null,
        username: paymentRequest.username
      },
      network,
      token
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
    PaymentActions.approveTokenAllowance,
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
    PaymentActions.approveTokenAllowanceFailure,
    PaymentActions.approveTokenAllowanceSuccess,
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
    PaymentActions.updatedToken,
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
    (state, { usdAmount, tokenAmount }): IPaymentRequestState => ({
      ...state,
      conversion: {
        loading: false,
        error: null,
        data: {
          ...state.conversion.data,
          usdAmount,
          tokenAmount
        }
      }
    })
  ),
  on(
    PaymentActions.switchToUsd,
    (state, { priceInUsdEnabled }): IPaymentRequestState => ({
      ...state,
      conversion: {
        ...state.conversion,
        data: {
          ...state.conversion.data,
          priceInUsdEnabled
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
  ),
  on(
    PaymentActions.smartContractCanTransferResponse,
    (state, { isTransferable }): IPaymentRequestState => ({
      ...state,
      smartContractCanTransfer: isTransferable
    })
  )
);

export function reducer(state: IPaymentRequestState = initialState, action: Action): IPaymentRequestState {
  return authReducer(state, action);
}
