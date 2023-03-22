import { IProfileAdded, StoreState } from '../../../shared/interfaces';

export const PAYMENT_REQUEST_FEATURE_KEY = 'paymentRequest';

export interface IPaymentRequestState {
  publicAddress: string | null;
  verifiedAccount: boolean;
  userAccount: StoreState<IProfileAdded | null>;
  amount: number | null;
}

export interface PaymentRequestState {
  readonly [PAYMENT_REQUEST_FEATURE_KEY]: IPaymentRequestState;
}
