import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { IPoolDetail, ITokenAndBalance } from '../../../shared/interfaces';
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
    SwapActions.createPoolActionSuccess,
    SwapActions.loadPoolActionSuccess,
    (state: ISwapState, action: { result: IPoolDetail }): ISwapState => ({
      ...state,
      searchPool: {
        data: action.result,
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
  ),
  on(
    SwapActions.lookUpTokenAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      tokenSearch: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    SwapActions.lookUpTokenActionSuccess,
    (state: ISwapState, action: { result: ITokenAndBalance }): ISwapState => ({
      ...state,
      tokenSearch: {
        data: action.result.token,
        loading: false,
        error: null
      }
    })
  ),
  on(
    SwapActions.lookUpTokenActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      tokenSearch: {
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
