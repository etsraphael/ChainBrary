import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { createAction, props } from '@ngrx/store';
import { IPaymentRequest, IProfileAdded, IToken } from './../../../shared/interfaces';

export const initPaymentRequestMaker = createAction('[Payment Request] Init Payment Request Maker');

export const selectToken = createAction('[Payment Request] Select Token', props<{ token: IToken | null }>());

export const updatedToken = createAction('[Payment Request] Updated Token', props<{ token: IToken }>());

export const applyConversionToken = createAction(
  '[Payment Request] Apply Conversion Token',
  props<{ amount: number; amountInUsd: boolean }>()
);
export const applyConversionTokenSuccess = createAction(
  '[Payment Request] Apply Conversion Token Success',
  props<{ usdAmount: number; tokenAmount: number; amountInUsd: boolean }>()
);
export const applyConversionTokenFailure = createAction(
  '[Payment Request] Apply Conversion Token Failure',
  props<{ errorMessage: string; amountInUsd: boolean }>()
);
export const applyConversionNotSupported = createAction(
  '[Payment Request] Apply Conversion Not Supported',
  props<{ amountInToken: number }>()
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

export const smartContractCanTransfer = createAction('[Payment Request] Smart Contract Can Transfer');
export const smartContractCanTransferSuccess = createAction(
  '[Payment Request] Smart Contract Is Transferable',
  props<{ isTransferable: boolean }>()
);
export const smartContractCanTransferFailure = createAction(
  '[Payment Request] Smart Contract Is Not Transferable',
  props<{ message: string }>()
);

export const approveTokenAllowance = createAction('[Payment Request] Approve Token Allowance');
export const approveTokenAllowanceSuccess = createAction('[Payment Request] Approve Token Allowance Success');
export const approveTokenAllowanceFailure = createAction(
  '[Payment Request] Approve Token Allowance Failure',
  props<{ errorMessage: string }>()
);
