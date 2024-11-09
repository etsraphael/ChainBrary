import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IPoolDetail, StoreState } from '../../../shared/interfaces';
import { ISwapState, SWAP_FEATURE_KEY } from './interfaces';

export const selectSwapState = createFeatureSelector<ISwapState>(SWAP_FEATURE_KEY);

export const selectPoolIsNotCreated: MemoizedSelector<object, boolean> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.searchPool.error === 'Pool_not_found'
);

export const selectPoolDetail: MemoizedSelector<object, StoreState<IPoolDetail | null>> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.searchPool
);
