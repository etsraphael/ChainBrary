import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { StoreState } from '../../../shared/interfaces';
import { IBid } from '../../../shared/interfaces/bid.interface';
import { BID_FEATURE_KEY, IBidState } from './interfaces';

export const selectBid = createFeatureSelector<IBidState>(BID_FEATURE_KEY);

export const selectCurrentBid: MemoizedSelector<object, StoreState<IBid | null>> = createSelector(
  selectBid,
  (s: IBidState) => s.currentBid
);
