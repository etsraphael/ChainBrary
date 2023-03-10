import { AuthState } from './auth-store/state/interfaces';
import { IGlobalState } from './global-store/state/interfaces';

export interface RootState {
  auth: AuthState;
  global: IGlobalState;
}
