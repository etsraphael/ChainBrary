import { ActionStoreProcessing } from './../../../shared/interfaces';

export const TOKEN_MANAGEMENT_FEATURE_KEY = 'token-management';

export interface ITokenManagementState {
  tokenCreation: ActionStoreProcessing;
}

export interface VaultState {
  readonly [TOKEN_MANAGEMENT_FEATURE_KEY]: ITokenManagementState;
}
