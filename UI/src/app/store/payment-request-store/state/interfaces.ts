import { IPaymentRequest, StoreState, IProfilePayment } from '../../../shared/interfaces';

export const PAYMENT_REQUEST_FEATURE_KEY = 'paymentRequest';

export interface IPaymentRequestState {
  payment: StoreState<IPaymentRequest | null>;
  profile: IProfilePayment;
}

export interface PaymentRequestState {
  readonly [PAYMENT_REQUEST_FEATURE_KEY]: IPaymentRequestState;
}
