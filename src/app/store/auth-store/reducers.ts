import { Action, createReducer } from '@ngrx/store';
import { IAuth } from 'src/app/shared/interfaces';
import { initialState } from './init';

export const authReducer = createReducer(initialState);

export function reducer(state: IAuth = initialState, action: Action): IAuth {
  return authReducer(state, action);
}
