import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { initialState } from './init';
import { IAuthState } from './interfaces';
import * as AuthActions from './actions';

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
  on(
    AuthActions.loadAuthSuccess,
    (state, { auth, organization }): IAuthState => ({
      ...state,
      publicAddress: auth.userAddress,
      verifiedAccount: true,
      connectedUser: true,
      userAccount: {
        error: null,
        loading: false,
        data: {
          id: auth.id,
          userName: auth.userName,
          imgUrl: auth.imgUrl,
          expirationDate: 1677862956,
          userAddress: auth.userAddress,
          blockTimestamp: auth.blockTimestamp,
          description: auth.description
        }
      },
      organization: organization
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
    AuthActions.setAuthPublicAddress,
    (_, { publicAddress }): IAuthState => ({
      ...initialState,
      publicAddress: publicAddress,
      connectedUser: true
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
