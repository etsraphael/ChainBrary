import { IAuthState } from './interfaces';

// export const initialState: IAuthState = {
//   publicAddress: null,
//   verifiedAccount: false,
//   connectedUser: false,
//   userAccount: {
//     loading: false,
//     error: null,
//     data: null
//   }
// };

export const initialState: IAuthState = {
  publicAddress: '0xB790F2178D35f244D9EecF1130496309eAE063be',
  verifiedAccount: false,
  connectedUser: true,
  userAccount: {
    loading: false,
    error: null,
    data: null
  }
};
