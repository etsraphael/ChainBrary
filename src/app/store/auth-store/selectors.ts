import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IAuth } from 'src/app/shared/interfaces';
import { AUTH_FEATURE_KEY } from './interfaces';

export const selectAuth = createFeatureSelector<IAuth>(AUTH_FEATURE_KEY);

export const selectVerifiedAccount: MemoizedSelector<IAuth, boolean, (s1: IAuth) => boolean> = createSelector(
  selectAuth,
  (s) => s.verifiedAccount
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
