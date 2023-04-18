import { Action, ActionReducer, createReducer } from '@ngrx/store';
import { initialState } from './init';
import { IGlobalState } from './interfaces';

export const globalReducer: ActionReducer<IGlobalState, Action> = createReducer(initialState);

export function reducer(state: IGlobalState = initialState, action: Action): IGlobalState {
  return globalReducer(state, action);
}
