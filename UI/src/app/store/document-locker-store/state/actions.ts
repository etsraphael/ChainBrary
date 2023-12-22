import { createAction, props } from '@ngrx/store';
import { IDocumentLockerCreation, IDocumentLockerResponse } from '../../../shared/interfaces';

export const createDocumentLocker = createAction(
  '[DocumentLocker] Create DocumentLocker',
  props<{ payload: IDocumentLockerCreation }>()
);
export const createDocumentLockerSuccess = createAction(
  '[DocumentLocker] Create DocumentLocker Success',
  props<{ txn: string }>()
);
export const createDocumentLockerFailure = createAction(
  '[DocumentLocker] Create DocumentLocker Failure',
  props<{ message: string }>()
);

export const documentLockerChecking = createAction(
  '[DocumentLocker] DocumentLocker Creation Looking',
  props<{ txn: string }>()
);
export const documentLockerCheckingSuccess = createAction(
  '[DocumentLocker] DocumentLocker Creation Looking Success',
  props<{ payload: IDocumentLockerResponse; txn: string }>()
);
export const documentLockerCheckingFailure = createAction(
  '[DocumentLocker] DocumentLocker Creation Looking Failure',
  props<{ message: string; txn: string }>()
);
export const documentLockerCheckingEnd = createAction('[DocumentLocker] Bid Creation Looking End');

export const getDocumentLockerByTxn = createAction(
  '[DocumentLocker] Get DocumentLocker By Txn',
  props<{ txn: string }>()
);
export const getDocumentLockerByTxnSuccess = createAction(
  '[DocumentLocker] Get DocumentLocker By Txn Success',
  props<{ payload: IDocumentLockerResponse }>()
);
export const getDocumentLockerByTxnFailure = createAction(
  '[DocumentLocker] Get DocumentLocker By Txn Failure',
  props<{ message: string }>()
);

export const unlockDocument = createAction('[DocumentLocker] Unlock Document', props<{ hasAccess: boolean }>());
export const unlockDocumentSuccess = createAction(
  '[DocumentLocker] Unlock Document Success',
  props<{ txn: string; contractAddress: string }>()
);
export const unlockDocumentFailure = createAction(
  '[DocumentLocker] Unlock Document Failure',
  props<{ message: string }>()
);

export const documentLockerRefreshCheck = createAction('[DocumentLocker] DocumentLocker Refresh Check');
export const documentLockerRefreshCheckSuccess = createAction(
  '[DocumentLocker] DocumentLocker Refresh Check Success',
  props<{ bidDetails: IDocumentLockerResponse }>()
);
export const documentLockerRefreshCheckFailure = createAction(
  '[DocumentLocker] DocumentLocker Refresh Check Failure',
  props<{ message: string }>()
);

export const reset = createAction('[DocumentLocker] Reset Document Locker');
