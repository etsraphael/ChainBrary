import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as VaultsActions from './actions';
import { initialState } from './init';
import { IVaultsState } from './interfaces';

export const authReducer: ActionReducer<IVaultsState, Action> = createReducer(
  initialState,
  on(VaultsActions.resetVaults, (): IVaultsState => initialState),
  on(
    VaultsActions.loadVaults,
    (state): IVaultsState => ({
      ...state,
      vaultList: {
        data: [],
        loading: true,
        error: null
      }
    })
  ),
  on(
    VaultsActions.loadVaultsFailure,
    (state, { message }): IVaultsState => ({
      ...state,
      vaultList: {
        data: [],
        loading: false,
        error: message
      }
    })
  ),
  on(
    VaultsActions.loadVaultsSuccess,
    (state, action): IVaultsState => ({
      ...state,
      vaultList: {
        data: action.list,
        loading: false,
        error: null
      }
    })
  )
);

export function reducer(state: IVaultsState = initialState, action: Action): IVaultsState {
  return authReducer(state, action);
}
