import { AuthState } from './auth-store/state/interfaces';
import { GlobalState } from './global-store/state/interfaces';

export interface State {
  auth: AuthState;
  global: GlobalState;
}
