import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { FullAndShortNumber, IProfileAdded } from '../../../shared/interfaces';
import { AuthStatusCode } from './../../../../app/shared/enum';
import { AUTH_FEATURE_KEY, IAuthState } from './interfaces';

export const selectAuth = createFeatureSelector<IAuthState>(AUTH_FEATURE_KEY);

export const selectCurrentNetwork: MemoizedSelector<object, INetworkDetail | null> = createSelector(selectAuth, (s) =>
  s.network ? s.network : null
);

export const selectCurrentChainId: MemoizedSelector<object, NetworkChainId | null> = createSelector(selectAuth, (s) =>
  s.network ? s.network.chainId : null
);

export const selectNetworkSymbol: MemoizedSelector<object, string | null> = createSelector(
  selectAuth,
  (s) => s.network?.nativeCurrency.symbol ?? null
);

export const selectNetworkName: MemoizedSelector<object, string | null> = createSelector(
  selectAuth,
  (s) => s.network?.shortName ?? null
);

export const selectAccount: MemoizedSelector<object, IProfileAdded | null> = createSelector(
  selectAuth,
  (s) => s.userAccount.data
);

export const selectPublicAddress: MemoizedSelector<object, string | null> = createSelector(
  selectAuth,
  (s) => s.publicAddress
);

export const selectAvatarUrl: MemoizedSelector<object, string | undefined> = createSelector(
  selectAuth,
  (s) => s.userAccount.data?.imgUrl
);

export const selectErrorAccount: MemoizedSelector<object, string | null> = createSelector(
  selectAuth,
  (s) => s.userAccount.error
);

export const selectIsConnected: MemoizedSelector<object, boolean> = createSelector(selectAuth, (s) => s.connectedUser);

export const selectDailyPrice: MemoizedSelector<object, number | undefined> = createSelector(
  selectAuth,
  (s) => s.organization?.pricePerDay
);

export const selectAuthStatus: MemoizedSelector<object, AuthStatusCode> = createSelector(selectAuth, (s) =>
  s.connectedUser ? AuthStatusCode.Connected : AuthStatusCode.NotConnected
);

export const selectUserAccountIsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectAuth,
  (s) => s.userAccount.loading
);

export const selectBalance: MemoizedSelector<object, FullAndShortNumber | null> = createSelector(
  selectAuth,
  (s) => s.balance
);
