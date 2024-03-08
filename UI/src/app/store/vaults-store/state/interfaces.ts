import { StoreState, Vault } from '../../../shared/interfaces';

export const VAULTS_FEATURE_KEY = 'vaults';

export interface IVaultsState {
  vaultList: (StoreState<Vault|null>)[];
  errorMessage: string | null;
}

export interface VaultState {
  readonly [VAULTS_FEATURE_KEY]: IVaultsState;
}
