import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as VaultsActions from './actions';
import { initialState } from './init';
import { ITokenManagementState } from './interfaces';

export const authReducer: ActionReducer<ITokenManagementState, Action> = createReducer(
  initialState,
  on(VaultsActions.resetTokenManagement, (): ITokenManagementState => initialState)
);

export function reducer(state: ITokenManagementState = initialState, action: Action): ITokenManagementState {
  return authReducer(state, action);
}
