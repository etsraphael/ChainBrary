import { WalletProvider } from '@chainbrary/web3-login';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { GLOBAL_FEATURE_KEY, IGlobalState } from './interfaces';

export const selectGlobal = createFeatureSelector<IGlobalState>(GLOBAL_FEATURE_KEY);

export const selectTheme: MemoizedSelector<object, string> = createSelector(
  selectGlobal,
  (state: IGlobalState) => state.theme
);

export const selectWalletConnected: MemoizedSelector<object, WalletProvider | null> = createSelector(
  selectGlobal,
  (state: IGlobalState) => state.walletConnected
);
