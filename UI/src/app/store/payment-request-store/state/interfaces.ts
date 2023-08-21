import { INetworkDetail } from '@chainbrary/web3-login';
import { IConversionToken, IPaymentRequest, IProfilePayment, IToken, StoreState } from '../../../shared/interfaces';

export const PAYMENT_REQUEST_FEATURE_KEY = 'paymentRequest';

export interface IPaymentRequestState {
  payment: StoreState<IPaymentRequest | null>;
  conversion: StoreState<IConversionToken>;
  token: IToken | null;
  profile: IProfilePayment;
  network: INetworkDetail | null;
  smartContractCanTransfer: boolean;
}

export interface PaymentRequestState {
  readonly [PAYMENT_REQUEST_FEATURE_KEY]: IPaymentRequestState;
}
