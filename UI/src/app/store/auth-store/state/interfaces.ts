import { IProfileAdded, IOrganization, StoreState } from '../../../shared/interfaces';

export const AUTH_FEATURE_KEY = 'auth';

export interface IAuthState {
  publicAddress: string | null;
  verifiedAccount: boolean;
  connectedUser: boolean;
  userAccount: StoreState<IProfileAdded | null>;
  organization: IOrganization | null;
  network: {
    networkId: string | null;
    networkName: string | null;
  };
}

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: IAuthState;
}
