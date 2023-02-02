import { Action, createReducer } from '@ngrx/store';
import { initialState } from './init';
import { IGlobalState } from './interfaces';

export const globalReducer = createReducer(initialState);

export function reducer(state: IGlobalState = initialState, action: Action): IGlobalState {
  return globalReducer(state, action);
}
