import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import web3 from 'web3';
import * as AuthActions from './actions';
import { initialState } from './init';
import { IAuthState } from './interfaces';

export const authReducer: ActionReducer<IAuthState, Action> = createReducer(
  initialState,
  on(
    AuthActions.loadAuth,
    (state): IAuthState => ({
      ...state,
      userAccount: {
        ...state.userAccount,
        error: null,
        loading: true
      }
    })
  ),
  on(AuthActions.saveBalance, (state, action): IAuthState => {
    const balanceInEther = web3.utils.fromWei(action.balance, 'ether');
    const truncatedBalance = balanceInEther.includes('.')
      ? balanceInEther.substring(0, balanceInEther.indexOf('.') + 5)
      : balanceInEther;
    return {
      ...state,
      balance: {
        full: Number(action.balance),
        short: truncatedBalance
      }
    };
  }),
  on(
    AuthActions.loadAuthSuccess,
    (state, { auth }): IAuthState => ({
      ...state,
      publicAddress: auth.userAddress,
      connectedUser: true,
      userAccount: {
        error: null,
        loading: false,
        data: {
          id: auth.id,
          userName: auth.userName,
          imgUrl: auth.imgUrl,
          expirationDate: auth.expirationDate,
          userAddress: auth.userAddress,
          blockTimestamp: auth.blockTimestamp,
          description: auth.description
        }
      }
    })
  ),
  on(
    AuthActions.loadOrgnisationSuccess,
    (state, { organization }): IAuthState => ({
      ...state,
      organization
    })
  ),
  on(
    AuthActions.loadAuthFailure,
    (state, { message }): IAuthState => ({
      ...state,
      userAccount: {
        error: message,
        loading: false,
        data: null
      }
    })
  ),
  on(
    AuthActions.networkChangeSuccess,
    (state, { network }): IAuthState => ({
      ...state,
      network: network
    })
  ),
  on(
    AuthActions.accountChanged,
    (state, { publicAddress }): IAuthState => ({
      ...state,
      publicAddress: publicAddress,
      userAccount: initialState.userAccount,
      organization: initialState.organization
    })
  ),
  on(
    AuthActions.setAuthPublicAddress,
    (_, { publicAddress, network }): IAuthState => ({
      ...initialState,
      publicAddress: publicAddress,
      connectedUser: true,
      network: network
    })
  ),
  on(
    AuthActions.resetAuth,
    (): IAuthState => ({
      ...initialState
    })
  )
);

export function reducer(state: IAuthState = initialState, action: Action): IAuthState {
  return authReducer(state, action);
}
