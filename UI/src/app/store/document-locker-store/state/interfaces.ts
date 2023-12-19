import {
  ActionStoreProcessing,
  IDocumentLockerCreation,
  IDocumentLockerResponse,
  IDocumentUnlockedResponse,
  StoreState
} from '../../../shared/interfaces';

export const DOCUMENT_LOCKER_FEATURE_KEY = 'documentLocker';

export interface IDocumentLockerState {
  dlCreation: StoreState<IDocumentLockerCreation | null>;
  dlRefreshCheck: StoreState<{ attempt: number }>;
  searchDocumentLocked: StoreState<IDocumentLockerResponse | IDocumentUnlockedResponse | null>;
  unlocking: ActionStoreProcessing;
}

export interface DocumentLockerState {
  readonly [DOCUMENT_LOCKER_FEATURE_KEY]: IDocumentLockerState;
}
