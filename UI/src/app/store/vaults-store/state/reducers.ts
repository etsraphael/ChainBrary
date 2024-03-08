import { INetworkDetail } from '@chainbrary/web3-login';
import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { StoreState, Vault } from './../../../shared/interfaces';
import * as VaultsActions from './actions';
import { initialState } from './init';
import { IVaultsState } from './interfaces';

export const authReducer: ActionReducer<IVaultsState, Action> = createReducer(
  initialState,
  on(VaultsActions.resetVaults, (): IVaultsState => initialState),
  on(VaultsActions.loadVaultById, (state, action: { networkDetail: INetworkDetail; txnHash: string }): IVaultsState => {
    const newList: StoreState<Vault | null>[] = [...state.vaultList];

    // Add the new vault to the list
    newList.push({
      data: {
        network: {
          contractAddress: action.txnHash,
          networkDetail: action.networkDetail
        },
        data: null
      },
      loading: true,
      error: null
    });

    // Add the new vault to the list
    return {
      ...state,
      vaultList: newList
    };
  }),
  on(VaultsActions.loadVaultByNetworkSuccess, (state, action: { vault: Vault }): IVaultsState => {
    const updatedList = state.vaultList.map((vault: StoreState<Vault | null>) => {
      if (vault.data?.network.networkDetail.chainId === action.vault.network.networkDetail.chainId) {
        return {
          ...vault,
          data: action.vault,
          loading: false
        };
      } else {
        return vault;
      }
    });
    return {
      ...state,
      vaultList: updatedList
    };
  })
);

export function reducer(state: IVaultsState = initialState, action: Action): IVaultsState {
  return authReducer(state, action);
}
