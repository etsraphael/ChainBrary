import { NetworkChainId } from '@chainbrary/web3-login';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { StoreState, Vault } from '../../../shared/interfaces';
import { IVaultsState, VAULTS_FEATURE_KEY } from './interfaces';

export const selectVaultState = createFeatureSelector<IVaultsState>(VAULTS_FEATURE_KEY);

export const selectVaults: MemoizedSelector<object, StoreState<Vault | null>[]> = createSelector(
  selectVaultState,
  (s: IVaultsState) => s.vaultList
);

export const selectIsVaultsLoaded: MemoizedSelector<object, boolean> = createSelector(
  selectVaults,
  (s: StoreState<Vault | null>[]) =>
    s.some((vault: StoreState<Vault | null>) => vault.loading === false && vault.data !== null)
);

export const selectVaultByChainId = (
  chainId: NetworkChainId
): MemoizedSelector<object, StoreState<Vault | null> | null> =>
  createSelector(
    selectVaults,
    (s: StoreState<Vault | null>[]) =>
      s.find((vault: StoreState<Vault | null>) => vault.data?.network.networkDetail.chainId === chainId) || null
  );

export const selectStakingErrorMessage: MemoizedSelector<object, string | null> = createSelector(
  selectVaultState,
  (s: IVaultsState) => s.errorMessage.staking
);

export const selectWithdrawingErrorMessage: MemoizedSelector<object, string | null> = createSelector(
  selectVaultState,
  (s: IVaultsState) => s.errorMessage.withdrawing
);
