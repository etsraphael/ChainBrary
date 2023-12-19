import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as DLActions from './actions';
import { initialState } from './init';
import { IDocumentLockerState } from './interfaces';

export const authReducer: ActionReducer<IDocumentLockerState, Action> = createReducer(
  initialState,
  on(DLActions.reset, (): IDocumentLockerState => initialState),
  on(
    DLActions.createDocumentLocker,
    (state): IDocumentLockerState => ({
      ...state,
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
  )
);

export function reducer(state: IDocumentLockerState = initialState, action: Action): IDocumentLockerState {
  return authReducer(state, action);
}
