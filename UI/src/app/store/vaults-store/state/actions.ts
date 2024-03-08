import { NetworkChainId } from '@chainbrary/web3-login';
import { createAction, props } from '@ngrx/store';
import { Vault } from '../../../shared/interfaces';

export const loadVaults = createAction('[Vaults] Load Vaults');

export const loadVaultById = createAction(
  '[Vaults] Load Vault By Id',
  props<{ chainId: NetworkChainId; txnHash: string }>()
);
export const loadVaultByNetworkSuccess = createAction(
  '[Vaults] Load Vault By Network Success',
  props<{ vault: Vault }>()
);
export const loadVaultByNetworkFailure = createAction(
  '[Vaults] Load Vault By Network Failure',
  props<{ message: string }>()
);

export const resetVaults = createAction('[Vaults] Reset Vaults');