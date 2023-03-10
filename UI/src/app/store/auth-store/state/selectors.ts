import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IProfileAdded } from '../../../shared/interfaces';
import { AuthStatusCode } from './../../../../app/shared/enum';
import { AUTH_FEATURE_KEY, IAuthState } from './interfaces';

export const selectAuth = createFeatureSelector<IAuthState>(AUTH_FEATURE_KEY);

export const selectVerifiedAccount: MemoizedSelector<object, boolean, (s1: IAuthState) => boolean> = createSelector(
  selectAuth,
  (s) => s.verifiedAccount
);

export const selectAccount: MemoizedSelector<object, IProfileAdded | null, (s1: IAuthState) => IProfileAdded | null> =
  createSelector(selectAuth, (s) => s.userAccount.data);

export const selectPublicAddress: MemoizedSelector<object, string | null, (s1: IAuthState) => string | null> =
  createSelector(selectAuth, (s) => s.publicAddress);

export const selectIsConnected: MemoizedSelector<object, boolean, (s1: IAuthState) => boolean> = createSelector(
  selectAuth,
  (s) => s.connectedUser
);

export const selectSideBarMode: MemoizedSelector<object, AuthStatusCode, (s1: IAuthState) => AuthStatusCode> =
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
