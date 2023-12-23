import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  ActionStoreProcessing,
  DocumentLockerRole,
  IDocumentLockerCreation,
  IDocumentLockerResponse,
  StoreState
} from '../../../shared/interfaces';
import { selectPublicAddress } from '../../auth-store/state/selectors';
import { DOCUMENT_LOCKER_FEATURE_KEY, IDocumentLockerState } from './interfaces';

export const selectDocumentLocker = createFeatureSelector<IDocumentLockerState>(DOCUMENT_LOCKER_FEATURE_KEY);

export const selectDocumentLockerCreation: MemoizedSelector<
  object,
  StoreState<IDocumentLockerCreation | null>
> = createSelector(selectDocumentLocker, (s: IDocumentLockerState) => s.dlCreation);

export const selectDocumentLockerCreationError: MemoizedSelector<object, string | null> = createSelector(
  selectDocumentLockerCreation,
  (s: StoreState<IDocumentLockerCreation | null>) => s.error
);

export const selectDlRefreshCheck: MemoizedSelector<object, StoreState<{ attempt: number }>> = createSelector(
  selectDocumentLocker,
  (s: IDocumentLockerState) => s.dlRefreshCheck
);

export const selectSearchDocumentLocked: MemoizedSelector<
  object,
  StoreState<IDocumentLockerResponse | null>
> = createSelector(selectDocumentLocker, (s: IDocumentLockerState) => s.searchDocumentLocked);

export const selectHasAccessToDocument: MemoizedSelector<object, DocumentLockerRole> = createSelector(
  selectDocumentLocker,
  selectPublicAddress,
  (s: IDocumentLockerState, authAddress: string | null) => {
    if (s.searchDocumentLocked.data?.ownerAddress.toLocaleLowerCase() === authAddress) return DocumentLockerRole.OWNER;
    else if (s.searchDocumentLocked.data?.accessAddress.toLocaleLowerCase() === authAddress)
      return DocumentLockerRole.BUYER;
    else return DocumentLockerRole.NONE;
  }
);

export const selectSearchDocumentLockedData: MemoizedSelector<object, IDocumentLockerResponse | null> = createSelector(
  selectSearchDocumentLocked,
  (s: StoreState<IDocumentLockerResponse | null>) => s.data
);

export const selectUnlocking: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectDocumentLocker,
  (s: IDocumentLockerState) => s.unlocking
);

export const selectDocumentLockerRefreshCheck: MemoizedSelector<
  object,
  StoreState<{ attempt: number }>
> = createSelector(selectDocumentLocker, (s: IDocumentLockerState) => s.dlRefreshCheck);

export const selectDocumentLockerContractAddress: MemoizedSelector<object, string | null> = createSelector(
  selectSearchDocumentLocked,
  (s: StoreState<IDocumentLockerResponse | null>) => s.data?.conctractAddress ?? null
);
