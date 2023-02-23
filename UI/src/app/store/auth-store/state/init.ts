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
  verifiedAccount: true,
  connectedUser: true,
  userAccount: {
    loading: false,
    error: null,
    data: {
      id: '0xB790F2178D35f244D9EecF1130496309eAE063be',
      userAddress: '0xB790F2178D35f244D9EecF1130496309eAE063be',
      username: 'rafael_salei',
      imgUrl: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1366&q=80',
      expirationDate: 0
    }
  }
};
