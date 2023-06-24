import { INetworkDetail } from '@chainbrary/web3-login';
import { IPaymentRequest, IProfilePayment, StoreState } from '../../../shared/interfaces';

export const PAYMENT_REQUEST_FEATURE_KEY = 'paymentRequest';

export interface IPaymentRequestState {
  payment: StoreState<IPaymentRequest | null>;
  profile: IProfilePayment;
  network: INetworkDetail | null;
}

export interface PaymentRequestState {
  readonly [PAYMENT_REQUEST_FEATURE_KEY]: IPaymentRequestState;
}
