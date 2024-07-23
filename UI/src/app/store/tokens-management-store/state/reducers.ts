import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as VaultsActions from './actions';
import { initialState } from './init';
import { ITokenManagementState } from './interfaces';
import * as tokenActions from './actions';

export const authReducer: ActionReducer<ITokenManagementState, Action> = createReducer(
  initialState,
  on(
    tokenActions.loadBalance,
    (state: ITokenManagementState): ITokenManagementState => ({
      ...state,
      balance: {
        loading: true,
        error: null,
        data: null
      }
    })
  ),
  on(
    tokenActions.loadBalanceSuccess,
    (state: ITokenManagementState, { balance }): ITokenManagementState => ({
      ...state,
      balance: {
        loading: false,
        error: null,
        data: balance
      }
    })
  ),
  on(
    tokenActions.loadBalanceFailure,
    (state: ITokenManagementState, { message }): ITokenManagementState => ({
      ...state,
      balance: {
        loading: false,
        error: message,
        data: null
      }
    })
  ),
  on(
    tokenActions.createToken,
    (state: ITokenManagementState): ITokenManagementState => ({
      ...state,
      tokenCreationIsProcessing: {
        isLoading: true,
        errorMessage: null
      }
    })
  ),
  on(
    tokenActions.createTokenFailure,
    (state: ITokenManagementState, { errorMessage }): ITokenManagementState => ({
      ...state,
      tokenCreationIsProcessing: {
        isLoading: false,
        errorMessage
      }
    })
  ),
  on(
    tokenActions.createTokenSuccess,
    (state: ITokenManagementState): ITokenManagementState => ({
      ...state,
      tokenCreationIsProcessing: {
        isLoading: false,
        errorMessage: null
      }
    })
  ),
  on(
    tokenActions.tokenCreationChecking,
    (state: ITokenManagementState): ITokenManagementState => ({
      ...state,
      tokenRefreshCheck: {
        data: {
          attempt: state.tokenRefreshCheck.data ? state.tokenRefreshCheck.data.attempt + 1 : 1
        },
        loading: true,
        error: null
      }
    })
  ),
  on(
    tokenActions.tokenCreationCheckingSuccess,
    (state: ITokenManagementState, { token }): ITokenManagementState => ({
      ...state,
      tokenCreationIsProcessing: {
        isLoading: false,
        errorMessage: null
      },
      tokenRefreshCheck: {
        ...state.tokenRefreshCheck,
        loading: false,
        error: null
      },
      tokenDetail: {
        loading: false,
        error: null,
        data: token
      }
    })
  ),
  on(
    tokenActions.tokenCreationCheckingFailure,
    (state: ITokenManagementState, { message }): ITokenManagementState => ({
      ...state,
      tokenRefreshCheck: {
        ...state.tokenRefreshCheck,
        loading: false,
        error: message
      }
    })
  ),
  on(
    tokenActions.loadTokenByTxnHash,
    (state: ITokenManagementState): ITokenManagementState => ({
      ...state,
      tokenDetail: {
        loading: true,
        error: null,
        data: null
      }
    })
  ),
  on(
    tokenActions.loadTokenByTxnHashSuccess,
    (state: ITokenManagementState, { token }): ITokenManagementState => ({
      ...state,
      tokenDetail: {
        loading: false,
        error: null,
        data: token
      }
    })
  ),
  on(
    tokenActions.loadTokenByTxnHashFailure,
    (state: ITokenManagementState, { message }): ITokenManagementState => ({
      ...state,
      tokenDetail: {
        loading: false,
        error: message,
        data: null
      }
    })
  ),
  on(VaultsActions.resetTokenManagement, (): ITokenManagementState => initialState)
);

export function reducer(state: ITokenManagementState = initialState, action: Action): ITokenManagementState {
  return authReducer(state, action);
}
