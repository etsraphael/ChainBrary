import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { IDocumentLockerResponse } from './../../../shared/interfaces';
import * as DLActions from './actions';
import { initialState } from './init';
import { IDocumentLockerState } from './interfaces';

export const authReducer: ActionReducer<IDocumentLockerState, Action> = createReducer(
  initialState,
  on(DLActions.resetDocumentLocker, (): IDocumentLockerState => initialState),
  on(
    DLActions.createDocumentLocker,
    (): IDocumentLockerState => ({
      ...initialState,
      dlCreation: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    DLActions.createDocumentLockerFailure,
    (state, { message }): IDocumentLockerState => ({
      ...state,
      dlCreation: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    DLActions.createDocumentLockerSuccess,
    (state): IDocumentLockerState => ({
      ...state,
      dlCreation: {
        data: null,
        loading: false,
        error: null
      }
    })
  ),
  on(
    DLActions.lockDocumentOnScreen,
    (state): IDocumentLockerState => ({
      ...state,
      searchDocumentLocked: {
        ...state.searchDocumentLocked,
        data: {
          ...(state.searchDocumentLocked.data as IDocumentLockerResponse),
          desc: undefined
        }
      },
      unlocking: initialState.unlocking
    })
  ),
  on(
    DLActions.getDocumentLockerByTxn,
    (state): IDocumentLockerState => ({
      ...state,
      searchDocumentLocked: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    DLActions.getDocumentLockerByTxnSuccess,
    (state, { payload }): IDocumentLockerState => ({
      ...state,
      searchDocumentLocked: {
        data: payload,
        loading: false,
        error: null
      }
    })
  ),
  on(
    DLActions.getDocumentLockerByTxnFailure,
    (state, { message }): IDocumentLockerState => ({
      ...state,
      searchDocumentLocked: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    DLActions.documentLockerChecking,
    (state): IDocumentLockerState => ({
      ...state,
      dlRefreshCheck: {
        data: {
          attempt: state.dlRefreshCheck.data ? state.dlRefreshCheck.data.attempt + 1 : 1
        },
        loading: true,
        error: null
      }
    })
  ),
  on(
    DLActions.documentLockerCheckingSuccess,
    (state): IDocumentLockerState => ({
      ...state,
      dlCreation: {
        ...state.dlCreation,
        loading: false,
        error: null
      },
      dlRefreshCheck: {
        ...state.dlRefreshCheck,
        loading: false,
        error: null
      }
    })
  ),
  on(
    DLActions.documentLockerCheckingFailure,
    (state, { message }): IDocumentLockerState => ({
      ...state,
      dlRefreshCheck: {
        ...state.dlRefreshCheck,
        loading: false,
        error: message
      }
    })
  ),
  on(
    DLActions.unlockDocument,
    (state): IDocumentLockerState => ({
      ...state,
      unlocking: {
        isLoading: true,
        errorMessage: null
      }
    })
  ),
  on(
    DLActions.unlockDocumentSuccess,
    (state): IDocumentLockerState => ({
      ...state,
      unlocking: {
        isLoading: false,
        errorMessage: null
      }
    })
  ),
  on(
    DLActions.unlockDocumentFailure,
    (state, action): IDocumentLockerState => ({
      ...state,
      unlocking: {
        isLoading: false,
        errorMessage: action.message
      }
    })
  )
);

export function reducer(state: IDocumentLockerState = initialState, action: Action): IDocumentLockerState {
  return authReducer(state, action);
}
