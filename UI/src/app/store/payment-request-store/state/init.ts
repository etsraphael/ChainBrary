import { IPaymentRequestState } from './interfaces';

export const initialState: IPaymentRequestState = {
  profile: {
    publicAddress: null,
    avatarUrl: null,
    username: null
  },
  payment: {
    loading: false,
    error: null,
    data: null
  },
  network: null,
  token: null,
  conversionToken: {
    loading: false,
    error: null,
    data: null
  },
  conversionUSD: {
    loading: false,
    error: null,
    data: null
  },
  smartContractCanTransfer: {
    loading: false,
    error: null,
    data: false
  },
  rawRequest: {
    loading: false,
    error: null,
    data: null
  },
  payNowIsProcessing: {
    isLoading: false,
    errorMessage: null
  }
};
