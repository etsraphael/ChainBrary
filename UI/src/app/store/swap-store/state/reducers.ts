import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as SwapActions from './actions';
import { initialState } from './init';
import { ISwapState } from './interfaces';

export const authReducer: ActionReducer<ISwapState, Action> = createReducer(
  initialState,
  on(SwapActions.resetSwapAction, (): ISwapState => initialState)
);

export function reducer(state: ISwapState = initialState, action: Action): ISwapState {
  return authReducer(state, action);
}
