import { createAction, props } from '@ngrx/store';
import { IPaymentRequest } from './../../../shared/interfaces';

export const generatePaymentRequest = createAction(
  '[Payment Request] Generate Payment Request',
  props<{ encodedRequest: string }>()
);
export const generatePaymentRequestSuccess = createAction(
  '[Payment Request] Generate Payment Request Success',
  props<{ paymentRequest: IPaymentRequest }>()
);
export const generatePaymentRequestFailure = createAction(
  '[Payment Request] Generate Payment Request Failure',
  props<{ error: string }>()
);
