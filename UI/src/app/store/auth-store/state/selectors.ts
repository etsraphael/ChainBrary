import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { AuthStatusCode } from './../../../../app/shared/enum';
import { IAuth, IUserAccount } from '../../../shared/interfaces';
import { AUTH_FEATURE_KEY } from './interfaces';

export const selectAuth = createFeatureSelector<IAuth>(AUTH_FEATURE_KEY);

export const selectVerifiedAccount: MemoizedSelector<IAuth, boolean, (s1: IAuth) => boolean> = createSelector(
  selectAuth,
  (s) => s.verifiedAccount
);

export const selectAccount: MemoizedSelector<IAuth, IUserAccount | null, (s1: IAuth) => IUserAccount | null> =
  createSelector(selectAuth, (s) => s.userAccount);

export const selectPublicAddress: MemoizedSelector<object, string | null, (s1: IAuth) => string | null> =
  createSelector(selectAuth, (s) => s.publicAddress);

export const selectIsConnected: MemoizedSelector<IAuth, boolean, (s1: IAuth) => boolean> = createSelector(
  selectAuth,
  (s) => s.connectedUser
);

export const selectSideBarMode: MemoizedSelector<object, AuthStatusCode, (s1: IAuth) => AuthStatusCode> =
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
