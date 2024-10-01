import { IPaymentRequestState } from './interfaces';

export const initialState: IPaymentRequestState = {
  requestDetail: {
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
  payNowIsProcessing: {
    isLoading: false,
    errorMessage: null
  }
};
