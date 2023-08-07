import { INetworkDetail } from '@chainbrary/web3-login';
import { IPaymentRequest, IProfilePayment, IToken, StoreState } from '../../../shared/interfaces';

export const PAYMENT_REQUEST_FEATURE_KEY = 'paymentRequest';

export interface IPaymentRequestState {
  payment: StoreState<IPaymentRequest | null>;
  token: IToken | null;
  profile: IProfilePayment;
  network: INetworkDetail | null;
}

export interface PaymentRequestState {
  readonly [PAYMENT_REQUEST_FEATURE_KEY]: IPaymentRequestState;
}
