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
  conversion: {
    loading: false,
    error: null,
    data: {
      usdAmount: null,
      tokenAmount: null,
      priceInUsdEnabled: false
    }
  },
  smartContractCanTransfer: false
};
