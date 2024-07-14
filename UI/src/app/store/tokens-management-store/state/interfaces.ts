import { ActionStoreProcessing, StoreState } from './../../../shared/interfaces';

export const TOKEN_MANAGEMENT_FEATURE_KEY = 'token-management';

export interface ITokenManagementState {
  tokenCreationIsProcessing: ActionStoreProcessing;
  tokenRefreshCheck: StoreState<{ attempt: number }>;
}

export interface VaultState {
  readonly [TOKEN_MANAGEMENT_FEATURE_KEY]: ITokenManagementState;
}
