import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { communityVaults } from './../../../data/communityVaults.data';
import { StoreState, Vault } from './../../../shared/interfaces';
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
      vaultList: communityVaults.map(() => {
        return {
          data: null,
          loading: true,
          error: null
        };
      })
    })
  ),
  on(
    VaultsActions.loadVaultByNetworkSuccess,
    (state, action: { vault: Vault }): IVaultsState => {
      const indexFound = state.vaultList.findIndex(vault => vault.loading);

      // If a loading vault is found, remove it; otherwise, use the original list
      const updatedVaultList = indexFound > -1
        ? [...state.vaultList.slice(0, indexFound), ...state.vaultList.slice(indexFound + 1)]
        : state.vaultList;

      // Add the new vault to the list
      return {
        ...state,
        vaultList: [
          ...updatedVaultList,
          {
            data: action.vault,
            loading: false,
            error: null
          }
        ]
      };
    }
  )


);

export function reducer(state: IVaultsState = initialState, action: Action): IVaultsState {
  return authReducer(state, action);
}
