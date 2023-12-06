import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { resetAuth } from '../../auth-store/state/actions';
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
      token,
      smartContractCanTransfer: initialState.smartContractCanTransfer
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
    PaymentActions.checkTokenAllowanceFailure,
    (state, { message }): IPaymentRequestState => ({
      ...state,
      smartContractCanTransfer: {
        ...state.smartContractCanTransfer,
        loading: false,
        error: message
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
  on(PaymentActions.applyConversionToken, (state, { amountInUsd }): IPaymentRequestState => {
    const key = amountInUsd ? 'conversionToken' : 'conversionUSD';
    return {
      ...state,
      [key]: {
        ...state[key],
        loading: true,
        error: null
      }
    };
  }),
  on(
    PaymentActions.applyConversionTokenSuccess,
    (state, { usdAmount, tokenAmount }): IPaymentRequestState => {
      return {
        ...state,
        conversionToken: {
          ...state.conversionToken,
          loading: false,
          error: null,
          data: tokenAmount
        },
        conversionUSD: {
          ...state.conversionUSD,
          loading: false,
          error: null,
          data: usdAmount
        }
      };

    }
  ),
  on(PaymentActions.applyConversionTokenFailure, (state, { errorMessage, amountInUsd }): IPaymentRequestState => {
    const key = amountInUsd ? 'conversionUSD' : 'conversionToken';
    return {
      ...state,
      [key]: {
        ...state[key],
        loading: false,
        error: errorMessage
      }
    };
  }),
  on(
    PaymentActions.applyConversionNotSupported,
    (state): IPaymentRequestState => ({
      ...state,
      conversionUSD: {
        loading: false,
        error: 'NOT_SUPPORTED',
        data: null
      }
    })
  ),
  on(
    PaymentActions.smartContractCanTransfer,
    (state): IPaymentRequestState => ({
      ...state,
      smartContractCanTransfer: {
        ...state.smartContractCanTransfer,
        loading: true,
        error: null
      }
    })
  ),
  on(
    PaymentActions.smartContractCanTransferSuccess,
    (state, { isTransferable }): IPaymentRequestState => ({
      ...state,
      smartContractCanTransfer: {
        loading: false,
        error: null,
        data: isTransferable
      }
    })
  ),
  on(
    PaymentActions.smartContractCanTransferFailure,
    (state, { message }): IPaymentRequestState => ({
      ...state,
      smartContractCanTransfer: {
        loading: false,
        error: message,
        data: false
      }
    })
  ),
  on(
    resetAuth,
    (state): IPaymentRequestState => ({
      ...state,
      conversionUSD: initialState.conversionUSD,
      conversionToken: initialState.conversionToken
    })
  )
);

export function reducer(state: IPaymentRequestState = initialState, action: Action): IPaymentRequestState {
  return authReducer(state, action);
}
