import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { resetAuth } from '../../auth-store/state/actions';
import * as PaymentActions from './actions';
import { initialState } from './init';
import { IPaymentRequestState } from './interfaces';
import { PaymentTypes } from './../../../shared/interfaces';

export const authReducer: ActionReducer<IPaymentRequestState, Action> = createReducer(
  initialState,
  on(
    PaymentActions.approveTokenAllowance,
    PaymentActions.sendAmount,
    (state): IPaymentRequestState => ({
      ...state,
      requestDetail: {
        ...state.requestDetail,
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
      requestDetail: {
        ...state.requestDetail,
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
  on(PaymentActions.applyConversionTokenSuccess, (state, { usdAmount, tokenAmount }): IPaymentRequestState => {
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
  }),
  on(PaymentActions.applyConversionTokenFailure, (state, { errorMessage, amountInUsd }): IPaymentRequestState => {
    const key = amountInUsd ? 'conversionToken' : 'conversionUSD';
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
    (state, { amountInToken }): IPaymentRequestState => ({
      ...state,
      conversionUSD: {
        loading: false,
        error: 'NOT_SUPPORTED',
        data: null
      },
      conversionToken: {
        loading: false,
        error: null,
        data: amountInToken
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
  ),
  on(
    PaymentActions.decryptRawPaymentRequest,
    (state): IPaymentRequestState => ({
      ...state,
      requestDetail: {
        ...state.requestDetail,
        loading: true,
        error: null
      }
    })
  ),
  on(
    PaymentActions.decryptRawPaymentRequestSuccess,
    (state, { requestDetail }): IPaymentRequestState => ({
      ...state,
      requestDetail: {
        loading: false,
        error: null,
        data: requestDetail
      }
    })
  ),
  on(
    PaymentActions.decryptRawPaymentRequestFailure,
    (state, { errorMessage }): IPaymentRequestState => ({
      ...state,
      requestDetail: {
        loading: false,
        error: errorMessage,
        data: null
      }
    })
  ),
  on(
    PaymentActions.applyConversionTokenFromPayNow,
    (state): IPaymentRequestState => ({
      ...state,
      conversionToken: {
        loading: true,
        error: null,
        data: null
      }
    })
  ),
  on(
    PaymentActions.applyConversionTokenFromPayNowSuccess,
    (state, action): IPaymentRequestState => ({
      ...state,
      [action.paymentType === PaymentTypes.USD ? 'conversionToken' : 'conversionUSD']: {
        loading: true,
        error: null,
        data: action.result
      },
      [action.paymentType === PaymentTypes.USD ? 'conversionUSD' : 'conversionToken']: {
        ...initialState[action.paymentType === PaymentTypes.USD ? 'conversionUSD' : 'conversionToken']
      }
    })
  ),
  on(
    PaymentActions.applyConversionTokenFromPayNowFailure,
    (state, action): IPaymentRequestState => ({
      ...state,
      conversionToken: {
        loading: false,
        error: action.errorMessage,
        data: null
      }
    })
  ),
  on(
    PaymentActions.payNowTransaction,
    (state): IPaymentRequestState => ({
      ...state,
      payNowIsProcessing: {
        isLoading: true,
        errorMessage: null
      }
    })
  ),
  on(
    PaymentActions.payNowTransactionFailure,
    (state, action): IPaymentRequestState => ({
      ...state,
      payNowIsProcessing: {
        isLoading: false,
        errorMessage: action.errorMessage
      }
    })
  )
);

export function reducer(state: IPaymentRequestState = initialState, action: Action): IPaymentRequestState {
  return authReducer(state, action);
}
