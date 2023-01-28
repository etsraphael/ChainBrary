import { Action, createReducer } from '@ngrx/store';
import { initialState } from './init';
import { IAuthState } from './interfaces';

export const authReducer = createReducer(initialState);

export function reducer(state: IAuthState = initialState, action: Action): IAuthState {
  return authReducer(state, action);
}
