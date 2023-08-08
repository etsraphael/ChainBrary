import { INetworkDetail } from '@chainbrary/web3-login';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IConversionToken, IPaymentRequest, IProfilePayment, IToken, StoreState } from './../../../shared/interfaces';
import { IPaymentRequestState, PAYMENT_REQUEST_FEATURE_KEY } from './interfaces';

export const selectPaymentRequest = createFeatureSelector<IPaymentRequestState>(PAYMENT_REQUEST_FEATURE_KEY);

export const selectPaymentRequestIsLoading: MemoizedSelector<object, boolean, (s1: IPaymentRequestState) => boolean> =
  createSelector(selectPaymentRequest, (s) => s.payment.loading);

export const selectPayment: MemoizedSelector<
  object,
  IPaymentRequest | null,
  (s1: IPaymentRequestState) => IPaymentRequest | null
> = createSelector(selectPaymentRequest, (s) => s.payment.data);

export const selectPaymentRequestError: MemoizedSelector<object, string | null> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.error
);

export const selectCardIsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.loading
);

export const selectPaymentNetwork: MemoizedSelector<object, INetworkDetail | null> = createSelector(
  selectPaymentRequest,
  (s) => s.network
);

export const selectPaymentToken: MemoizedSelector<object, IToken | null> = createSelector(
  selectPaymentRequest,
  (s) => s.token
);

export const selectPaymentConversion: MemoizedSelector<object, StoreState<IConversionToken>> = createSelector(
  selectPaymentRequest,
  (s) => s.conversion
);

export const selectProfilePayment: MemoizedSelector<
  object,
  IProfilePayment,
  (s1: IPaymentRequestState) => IProfilePayment
> = createSelector(selectPaymentRequest, (s) => s.profile);
