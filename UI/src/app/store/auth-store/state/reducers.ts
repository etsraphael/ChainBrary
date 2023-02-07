import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { initialState } from './init';
import { IAuthState } from './interfaces';
import * as AuthActions from './actions';

export const authReducer: ActionReducer<IAuthState, Action> = createReducer(
  initialState,
  on(AuthActions.loadAuthSuccess, (state, { auth }) => ({
    ...state,
    publicAddress: auth.userAddress,
    connectedUser: true
  }))
);

export function reducer(state: IAuthState = initialState, action: Action): IAuthState {
  return authReducer(state, action);
}
