import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IPaymentRequestState, PAYMENT_REQUEST_FEATURE_KEY } from './interfaces';

export const selectPaymentRequest = createFeatureSelector<IPaymentRequestState>(PAYMENT_REQUEST_FEATURE_KEY);

export const selectAccountIsLoading: MemoizedSelector<object, boolean, (s1: IPaymentRequestState) => boolean> =
  createSelector(selectPaymentRequest, (s) => s.userAccount.loading);
