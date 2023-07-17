import { IAuthState } from './interfaces';

export const initialState: IAuthState = {
  publicAddress: null,
  verifiedAccount: false,
  connectedUser: false,
  userAccount: {
    loading: false,
    error: null,
    data: null
  },
  organization: null,
  network: null
};
