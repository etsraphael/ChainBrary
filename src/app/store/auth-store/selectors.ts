import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { IAuth } from "src/app/shared/interfaces";
import { AUTH_FEATURE_KEY } from "./interfaces";

export const selectAuth = createFeatureSelector<IAuth>(AUTH_FEATURE_KEY);

export const selectVerifiedAccount: MemoizedSelector<IAuth, boolean, (s1: IAuth) => boolean> = createSelector(selectAuth, (s) => s.verifiedAccount);

// give me a function that is telling is i'm
// logged in or not
// logged and verified
// logged and not verified


// export const selectSideBarMode: MemoizedSelector<IAuth, string, (s1: IAuth) => string> = createSelector(selectAuth, (s) => {


//   switch (key) {
//     case value:

//       break;

//     default:

//       return 'logged'
//   }

// });
