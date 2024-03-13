import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { createAction, props } from '@ngrx/store';
import { Vault } from '../../../shared/interfaces';

export const loadVaults = createAction('[Vaults] Load Vaults');

export const loadVaultById = createAction(
  '[Vaults] Load Vault By Id',
  props<{ networkDetail: INetworkDetail; contractAddress: string; rpcUrl: string }>()
);
export const loadVaultByNetworkSuccess = createAction(
  '[Vaults] Load Vault By Network Success',
  props<{ vault: Vault }>()
);
export const loadVaultByNetworkFailure = createAction(
  '[Vaults] Load Vault By Network Failure',
  props<{ chainId: NetworkChainId; message: string }>()
);

export const addTokensToVault = createAction(
  '[Vaults] Add Tokens To Vault',
  props<{ amount: number; chainId: NetworkChainId }>()
);
export const addTokensToVaultSuccess = createAction(
  '[Vaults] Add Tokens To Vault Success',
  props<{ chainId: NetworkChainId; hash: string }>()
);
export const addTokensToVaultFailure = createAction(
  '[Vaults] Add Tokens To Vault Failure',
  props<{ chainId: NetworkChainId; message: string }>()
);

export const resetVaults = createAction('[Vaults] Reset Vaults');
