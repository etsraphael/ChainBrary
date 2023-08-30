import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { createAction, props } from '@ngrx/store';
import { IPaymentRequest, IProfileAdded, IToken } from './../../../shared/interfaces';

export const initPaymentRequestMaker = createAction('[Payment Request] Init Payment Request Maker');

export const selectToken = createAction('[Payment Request] Select Token', props<{ token: IToken | null }>());

export const updatedToken = createAction('[Payment Request] Updated Token', props<{ token: IToken | null }>());

export const switchToUsd = createAction('[Payment Request] Switch To USD', props<{ priceInUsdEnabled: boolean }>());

export const applyConversionToken = createAction(
  '[Payment Request] Apply Conversion Token',
  props<{ amount: number }>()
);
export const applyConversionTokenSuccess = createAction(
  '[Payment Request] Apply Conversion Token Success',
  props<{ usdAmount: number; tokenAmount: number }>()
);
export const applyConversionTokenFailure = createAction(
  '[Payment Request] Apply Conversion Token Failure',
  props<{ errorMessage: string }>()
);

export const generatePaymentRequest = createAction(
  '[Payment Request] Generate Payment Request',
  props<{ encodedRequest: string }>()
);
export const generatePaymentRequestSuccess = createAction(
  '[Payment Request] Generate Payment Request Success',
  props<{ paymentRequest: IPaymentRequest; network: INetworkDetail; token: IToken }>()
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

export const sendAmount = createAction('[Payment Request] Send Amount Transactions', props<{ priceValue: string }>());
export const amountSent = createAction(
  '[Payment Request] Amount Sent',
  props<{ hash: string; chainId: NetworkChainId }>()
);
export const amountSentSuccess = createAction(
  '[Payment Request] Amount Sent Success',
  props<{ hash: string; numberConfirmation: number }>()
);
export const amountSentFailure = createAction('[Payment Request] Amount Sent Failure', props<{ message: string }>());

export const checkTokenAllowance = createAction('[Payment Request] Check Token Allowance');
export const checkTokenAllowanceSuccess = createAction(
  '[Payment Request] Check Token Allowance Success',
  props<{ isAllowed: boolean }>()
);
export const checkTokenAllowanceFailure = createAction(
  '[Payment Request] Check Token Allowance Failure',
  props<{ errorMessage: string }>()
);
export const smartContractIsTransferable = createAction(
  '[Payment Request] Smart Contract Is Transferable',
  props<{ isTransferable: boolean }>()
);

export const approveTokenAllowance = createAction('[Payment Request] Approve Token Allowance');
export const approveTokenAllowanceSuccess = createAction('[Payment Request] Approve Token Allowance Success');
export const approveTokenAllowanceFailure = createAction(
  '[Payment Request] Approve Token Allowance Failure',
  props<{ errorMessage: string }>()
);

export const signTransactionTokenPayment = createAction('[Payment Request] Sign Transaction Token Payment');
export const signTransactionTokenPaymentSuccess = createAction(
  '[Payment Request] Sign Transaction Token Payment Success'
);
export const signTransactionTokenPaymentFailure = createAction(
  '[Payment Request] Sign Transaction Token Payment Failure',
  props<{ errorMessage: string }>()
);
