import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  ActionStoreProcessing,
  IDocumentLockerCreation,
  IDocumentLockerResponse,
  IDocumentUnlockedResponse,
  StoreState
} from '../../../shared/interfaces';
import { DOCUMENT_LOCKER_FEATURE_KEY, IDocumentLockerState } from './interfaces';

export const selectDocumentLocker = createFeatureSelector<IDocumentLockerState>(DOCUMENT_LOCKER_FEATURE_KEY);

export const selectDocumentLockerCreation: MemoizedSelector<
  object,
  StoreState<IDocumentLockerCreation | null>
> = createSelector(selectDocumentLocker, (s: IDocumentLockerState) => s.dlCreation);

export const selectDlRefreshCheck: MemoizedSelector<object, StoreState<{ attempt: number }>> = createSelector(
  selectDocumentLocker,
  (s: IDocumentLockerState) => s.dlRefreshCheck
);

export const selectSearchDocumentLocked: MemoizedSelector<
  object,
  StoreState<IDocumentLockerResponse | IDocumentUnlockedResponse | null>
> = createSelector(selectDocumentLocker, (s: IDocumentLockerState) => s.searchDocumentLocked);

export const selectUnlocking: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectDocumentLocker,
  (s: IDocumentLockerState) => s.unlocking
);
