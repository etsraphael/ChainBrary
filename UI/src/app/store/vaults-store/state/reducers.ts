import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { StoreState, Vault } from './../../../shared/interfaces';
import * as VaultsActions from './actions';
import { initialState } from './init';
import { IVaultsState } from './interfaces';
import { communityVaults } from './../../../data/communityVaults.data';

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

      const icon: string = communityVaults.find((vault) => vault.contractAddress === action.contractAddress)
        ?.icon as string;

      console.log('icon', icon);

      // Add the new vault to the list only if it doesn't already exist
      if (!exists) {
        newList.push({
          data: {
            network: {
              icon: icon,
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
    const updatedList: StoreState<Vault | null>[] = state.vaultList.map((vault: StoreState<Vault | null>) => {
      if (vault.data?.network.networkDetail.chainId === action.vault.network.networkDetail.chainId) {
        return {
          ...vault,
          data: {
            ...vault.data,
            data: action.vault.data
          },
          loading: false
        };
      } else {
        return vault;
      }
    });
    return {
      ...state,
      vaultList: updatedList,
      errorMessage: initialState.errorMessage
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
  ),
  on(VaultsActions.addTokensToVault, (state): IVaultsState => {
    return {
      ...state,
      errorMessage: {
        ...state.errorMessage,
        staking: null
      }
    };
  }),
  on(
    VaultsActions.addTokensToVaultFailure,
    (state, action: { chainId: NetworkChainId; message: string }): IVaultsState => {
      return {
        ...state,
        errorMessage: {
          ...state.errorMessage,
          staking: action.message
        }
      };
    }
  ),
  on(VaultsActions.withdrawTokensFromVault, (state): IVaultsState => {
    return {
      ...state,
      errorMessage: {
        ...state.errorMessage,
        withdrawing: null
      }
    };
  }),
  on(
    VaultsActions.withdrawTokensFromVaultFailure,
    (state, action: { chainId: NetworkChainId; message: string }): IVaultsState => {
      return {
        ...state,
        errorMessage: {
          ...state.errorMessage,
          withdrawing: action.message
        }
      };
    }
  )
);

export function reducer(state: IVaultsState = initialState, action: Action): IVaultsState {
  return authReducer(state, action);
}
