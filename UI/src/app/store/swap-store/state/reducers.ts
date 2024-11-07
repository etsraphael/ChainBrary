import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as SwapActions from './actions';
import { initialState } from './init';
import { ISwapState } from './interfaces';

export const authReducer: ActionReducer<ISwapState, Action> = createReducer(
  initialState,
  on(SwapActions.resetSwapAction, (): ISwapState => initialState),
  on(
    SwapActions.loadPoolAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      searchPool: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadPoolActionSuccess,
    (state: ISwapState): ISwapState => ({
      ...state,
      searchPool: {
        data: null, // TODO: Replace with real data soon
        loading: false,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadPoolActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      searchPool: {
        data: null,
        loading: false,
        error: message
      }
    })
  )
);

export function reducer(state: ISwapState = initialState, action: Action): ISwapState {
  return authReducer(state, action);
}
