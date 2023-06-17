import { createAction, props } from '@ngrx/store';
import { IPaymentRequest, IProfileAdded } from './../../../shared/interfaces';

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
  props<{ errorMessage: string }>()
);

export const loadVerifiedAccount = createAction(
  '[Payment Request] Load Verified Account',
  props<{ address: string }>()
);
export const loadVerifiedAccountSuccess = createAction(
  '[Payment Request] Load Verified Account Success',
  props<{ verifiedAccount: IProfileAdded }>()
);
export const loadVerifiedAccountFailure = createAction(
  '[Payment Request] Load Verified Account Failure',
  props<{ errorMessage: string }>()
);

export const amountSent = createAction('[Payment Request] Amount Sent', props<{ hash: string; chainId: number }>());

export const amountSentSuccess = createAction(
  '[Payment Request] Amount Sent Success',
  props<{ hash: string; numberConfirmation: number }>()
);
export const amountSentFailure = createAction('[Payment Request] Amount Sent Failure', props<{ message: string }>());
