import { INetworkDetail } from '@chainbrary/web3-login';
import { FullAndShortNumber, IOrganization, IProfileAdded, StoreState } from '../../../shared/interfaces';

export const AUTH_FEATURE_KEY = 'auth';

export interface IAuthState {
  publicAddress: string | null;
  connectedUser: boolean;
  userAccount: StoreState<IProfileAdded | null>;
  organization: IOrganization | null;
  network: INetworkDetail | null;
  balance: FullAndShortNumber | null;
}

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: IAuthState;
}
