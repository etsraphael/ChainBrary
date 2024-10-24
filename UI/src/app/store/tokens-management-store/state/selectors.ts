import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ActionStoreProcessing, ITokenSetup, StoreState } from '../../../shared/interfaces';
import { ITokenManagementState, TOKEN_MANAGEMENT_FEATURE_KEY } from './interfaces';

export const selectTokenManagementState = createFeatureSelector<ITokenManagementState>(TOKEN_MANAGEMENT_FEATURE_KEY);

export const selectTokenCreationIsProcessing: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectTokenManagementState,
  (s: ITokenManagementState) => s.tokenCreationIsProcessing
);

export const selectTokenCreationRefreshCheck: MemoizedSelector<
  object,
  StoreState<{ attempt: number }>
> = createSelector(selectTokenManagementState, (s: ITokenManagementState) => s.tokenRefreshCheck);

export const selectTokenDetail: MemoizedSelector<object, StoreState<ITokenSetup | null>> = createSelector(
  selectTokenManagementState,
  (s: ITokenManagementState) => s.tokenDetail
);

export const selectTokenDetailData: MemoizedSelector<object, ITokenSetup | null> = createSelector(
  selectTokenDetail,
  (s: StoreState<ITokenSetup | null>) => s.data
);

export const selectTokenBalance: MemoizedSelector<object, StoreState<number | null>> = createSelector(
  selectTokenManagementState,
  (s: ITokenManagementState) => s.balance
);

export const selectSearchToken: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectTokenManagementState,
  (s: ITokenManagementState) => s.searchToken
);
