import { INetworkDetail } from '@chainbrary/web3-login';
import {
  ActionStoreProcessing,
  IPaymentRequest,
  IPaymentRequestRaw,
  IToken,
  StoreState
} from '../../../shared/interfaces';

export const PAYMENT_REQUEST_FEATURE_KEY = 'paymentRequest';

export interface IPaymentRequestState {
  payment: StoreState<IPaymentRequest | null>;
  conversionToken: StoreState<number | null>;
  conversionUSD: StoreState<number | null>;
  smartContractCanTransfer: StoreState<boolean>;
  token: IToken | null;
  network: INetworkDetail | null;
  rawRequest: StoreState<IPaymentRequestRaw | null>;
  payNowIsProcessing: ActionStoreProcessing;
}

export interface PaymentRequestState {
  readonly [PAYMENT_REQUEST_FEATURE_KEY]: IPaymentRequestState;
}
