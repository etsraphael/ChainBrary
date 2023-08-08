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
      usdConversionRate: 0,
      tokenConversionRate: 0,
      usdAmount: null,
      tokenAmount: null,
      priceInUsdEnabled: false
    }
  }
};
