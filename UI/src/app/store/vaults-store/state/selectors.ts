import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { StoreState, Vault } from '../../../shared/interfaces';
import { IVaultsState, VAULTS_FEATURE_KEY } from './interfaces';

export const selectVaultState = createFeatureSelector<IVaultsState>(VAULTS_FEATURE_KEY);

export const selectVaults: MemoizedSelector<object, StoreState<Vault | null>[]> = createSelector(
  selectVaultState,
  (s: IVaultsState) => s.vaultList
);
