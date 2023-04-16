import { IPaymentRequestState } from './interfaces';

export const initialState: IPaymentRequestState = {
  profile: {
    publicAddress: null,
    avatarUrl: null,
    username: null,
    subtitle: null
  },
  payment: {
    loading: false,
    error: null,
    data: null
  }
};
