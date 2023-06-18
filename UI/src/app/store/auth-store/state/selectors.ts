import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IProfileAdded } from '../../../shared/interfaces';
import { AuthStatusCode } from './../../../../app/shared/enum';
import { AUTH_FEATURE_KEY, IAuthState } from './interfaces';
import { INetworkDetail } from '@chainbrary/web3-login';

export const selectAuth = createFeatureSelector<IAuthState>(AUTH_FEATURE_KEY);

export const selectVerifiedAccount: MemoizedSelector<object, boolean, (s1: IAuthState) => boolean> = createSelector(
  selectAuth,
  (s) => s.verifiedAccount
);

export const selectCurrentNetwork: MemoizedSelector<
  object,
  INetworkDetail | null,
  (s1: IAuthState) => INetworkDetail | null
> = createSelector(selectAuth, (s) => (s.network ? s.network : null));

export const selectNetworkSymbol: MemoizedSelector<object, string | null, (s1: IAuthState) => string | null> =
  createSelector(selectAuth, (s) => s.network?.nativeCurrency.symbol ?? null);

export const selectNetworkName: MemoizedSelector<object, string | null, (s1: IAuthState) => string | null> =
  createSelector(selectAuth, (s) => s.network?.shortName ?? null);

export const selectAccount: MemoizedSelector<object, IProfileAdded | null, (s1: IAuthState) => IProfileAdded | null> =
  createSelector(selectAuth, (s) => s.userAccount.data);

export const selectPublicAddress: MemoizedSelector<object, string | null, (s1: IAuthState) => string | null> =
  createSelector(selectAuth, (s) => s.publicAddress);

export const selectAvatarUrl: MemoizedSelector<object, string | undefined, (s1: IAuthState) => string | undefined> =
  createSelector(selectAuth, (s) => s.userAccount.data?.imgUrl);

export const selectErrorAccount: MemoizedSelector<object, string | null, (s1: IAuthState) => string | null> =
  createSelector(selectAuth, (s) => s.userAccount.error);

export const selectIsConnected: MemoizedSelector<object, boolean, (s1: IAuthState) => boolean> = createSelector(
  selectAuth,
  (s) => s.connectedUser
);

export const selectDailyPrice: MemoizedSelector<object, number | undefined, (s1: IAuthState) => number | undefined> =
  createSelector(selectAuth, (s) => s.organization?.pricePerDay);

export const selectAuthStatus: MemoizedSelector<object, AuthStatusCode, (s1: IAuthState) => AuthStatusCode> =
  createSelector(selectAuth, (s) => {
    const isVerified = s.verifiedAccount;
    const isAuth = s.connectedUser;

    switch (true) {
      case !isVerified && !isAuth:
        return AuthStatusCode.NotConnected;
      case !isVerified && isAuth:
        return AuthStatusCode.NotVerifiedAndConnected;
      case isVerified && isAuth:
        return AuthStatusCode.VerifiedAndConnected;
      default:
        return AuthStatusCode.NotConnected;
    }
  });

export const selectUserAccountIsLoading: MemoizedSelector<object, boolean, (s1: IAuthState) => boolean> =
  createSelector(selectAuth, (s) => s.userAccount.loading);
