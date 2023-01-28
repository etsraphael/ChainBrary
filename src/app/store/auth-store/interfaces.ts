import { IAuth } from '../../shared/interfaces';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: IAuth;
}
