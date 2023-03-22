import { IPaymentRequestState } from './interfaces';

export const initialState: IPaymentRequestState = {
  publicAddress: null,
  verifiedAccount: false,
  userAccount: {
    loading: false,
    error: null,
    data: null
  },
  amount: null
};
