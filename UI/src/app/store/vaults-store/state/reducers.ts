import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { StoreState, Vault } from './../../../shared/interfaces';
import * as VaultsActions from './actions';
import { initialState } from './init';
import { IVaultsState } from './interfaces';

export const authReducer: ActionReducer<IVaultsState, Action> = createReducer(
  initialState,
  on(VaultsActions.resetVaults, (): IVaultsState => initialState),
  on(
    VaultsActions.loadVaultById,
    (state, action: { networkDetail: INetworkDetail; contractAddress: string }): IVaultsState => {
      const newList: StoreState<Vault | null>[] = [...state.vaultList];

      // Check if the vault with the same contractAddress already exists
      const exists = newList.some(
        (vault: StoreState<Vault | null>) => vault.data?.network.networkDetail.chainId === action.networkDetail.chainId
      );

      // Add the new vault to the list only if it doesn't already exist
      if (!exists) {
        newList.push({
          data: {
            network: {
              contractAddress: action.contractAddress,
              networkDetail: action.networkDetail
            },
            data: null
          },
          loading: true,
          error: null
        });
      }

      // Add the new vault to the list
      return {
        ...state,
        vaultList: newList
      };
    }
  ),
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
  }),
  on(
    VaultsActions.loadVaultByNetworkFailure,
    (state, action: { chainId: NetworkChainId; message: string }): IVaultsState => {
      const updatedList = state.vaultList.map((vault: StoreState<Vault | null>) => {
        if (vault.data?.network.networkDetail.chainId === action.chainId) {
          return {
            ...vault,
            data: {
              ...vault.data,
              data: null
            },
            loading: false,
            error: action.message
          };
        } else {
          return vault;
        }
      });
      return {
        ...state,
        vaultList: updatedList
      };
    }
  )
);

export function reducer(state: IVaultsState = initialState, action: Action): IVaultsState {
  return authReducer(state, action);
}
