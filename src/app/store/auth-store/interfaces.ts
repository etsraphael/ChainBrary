import { IAuth } from "src/app/shared/interfaces";

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: IAuth;
}
