import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ActionStoreProcessing } from '../../../shared/interfaces';
import { ITokenManagementState, TOKEN_MANAGEMENT_FEATURE_KEY } from './interfaces';

export const selectTokenManagementState = createFeatureSelector<ITokenManagementState>(TOKEN_MANAGEMENT_FEATURE_KEY);

export const selectTokenManagementCreation: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectTokenManagementState,
  (s: ITokenManagementState) => s.tokenCreation
);
