import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { IAuth } from "src/app/shared/interfaces";
import { AUTH_FEATURE_KEY } from "./interfaces";

export const selectAuth = createFeatureSelector<IAuth>(AUTH_FEATURE_KEY);

export const selectVerifiedAccount: MemoizedSelector<IAuth, boolean, (s1: IAuth) => boolean> = createSelector(selectAuth, (s) => s.verifiedAccount);
