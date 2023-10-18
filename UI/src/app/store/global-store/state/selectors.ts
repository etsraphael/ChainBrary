import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GLOBAL_FEATURE_KEY, IGlobalState } from './interfaces';

export const selectGlobal = createFeatureSelector<IGlobalState>(GLOBAL_FEATURE_KEY);

export const selectTheme = createSelector(selectGlobal, (state: IGlobalState) => state.theme);

export const selectWalletConnected = createSelector(selectGlobal, (state: IGlobalState) => state.walletConnected);
