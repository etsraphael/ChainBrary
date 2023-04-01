import { IPaymentRequestState } from './interfaces';

export const initialState: IPaymentRequestState = {
  verifiedAccount: false,
  userAccount: {
    loading: false,
    error: null,
    data: null
  },
  payment: {
    loading: false,
    error: null,
    data: null
  }
};
