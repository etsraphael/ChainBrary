import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IAuth, IUserAccount } from '../../../shared/interfaces';
import { AUTH_FEATURE_KEY } from './interfaces';

export const selectAuth = createFeatureSelector<IAuth>(AUTH_FEATURE_KEY);

export const selectVerifiedAccount: MemoizedSelector<IAuth, boolean, (s1: IAuth) => boolean> = createSelector(
  selectAuth,
  (s) => s.verifiedAccount
);

export const selectAccount: MemoizedSelector<IAuth, IUserAccount | null, (s1: IAuth) => IUserAccount | null> =
  createSelector(selectAuth, (s) => s.userAccount);

export const selectPublicAddress: MemoizedSelector<IAuth, string | null, (s1: IAuth) => string | null> = createSelector(
  selectAuth,
  (s) => s.publicAddress
);

export const selectIsConnected: MemoizedSelector<IAuth, boolean, (s1: IAuth) => boolean> = createSelector(
  selectAuth,
  (s) => s.connectedUser
);

export const selectSideBarMode: MemoizedSelector<IAuth, 0 | 1 | 2, (s1: IAuth) => 0 | 1 | 2> = createSelector(
  selectAuth,
  (s) => {
    const isVerified = s.verifiedAccount;
    const isAuth = s.connectedUser;

    switch (isVerified && isAuth) {
      case !isVerified && !isAuth:
        return 0;
      case !isVerified && isAuth:
        return 1;
      case isVerified && isAuth:
        return 2;
      default:
        return 0;
    }
  }
);
