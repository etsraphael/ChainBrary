import { ActionStoreProcessing, ITokenSetup, StoreState } from './../../../shared/interfaces';
export const TOKEN_MANAGEMENT_FEATURE_KEY = 'token-management';

export interface ITokenManagementState {
  balance: StoreState<number | null>;
  tokenCreationIsProcessing: ActionStoreProcessing;
  searchToken: ActionStoreProcessing;
  tokenRefreshCheck: StoreState<{ attempt: number }>;
  tokenDetail: StoreState<ITokenSetup | null>;
}

export interface VaultState {
  readonly [TOKEN_MANAGEMENT_FEATURE_KEY]: ITokenManagementState;
}
