import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IPaymentRequest, IProfileAdded } from './../../../shared/interfaces';
import { IPaymentRequestState, PAYMENT_REQUEST_FEATURE_KEY } from './interfaces';

export const selectPaymentRequest = createFeatureSelector<IPaymentRequestState>(PAYMENT_REQUEST_FEATURE_KEY);

export const selectVerifiedAccountIsLoading: MemoizedSelector<object, boolean, (s1: IPaymentRequestState) => boolean> =
  createSelector(selectPaymentRequest, (s) => s.userAccount.loading);

export const selectPaymentRequestIsLoading: MemoizedSelector<object, boolean, (s1: IPaymentRequestState) => boolean> =
  createSelector(selectPaymentRequest, (s) => s.payment.loading);

export const selectPayment: MemoizedSelector<
  object,
  IPaymentRequest | null,
  (s1: IPaymentRequestState) => IPaymentRequest | null
> = createSelector(selectPaymentRequest, (s) => s.payment.data);

export const selectVerifiedAccount: MemoizedSelector<object, IProfileAdded | null> = createSelector(
  selectPaymentRequest,
  (s) => s.userAccount.data
);

export const selectIsVerifiedAccount: MemoizedSelector<object, boolean> = createSelector(
  selectPaymentRequest,
  (s) => s.verifiedAccount
);

export const selectPaymentRequestError: MemoizedSelector<object, string | null> = createSelector(
  selectPaymentRequest,
  (s) => s.payment.error
);
