import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ActionStoreProcessing, StoreState } from '../../../shared/interfaces';
import { IBid, IBidOffer } from '../../../shared/interfaces/bid.interface';
import { BID_FEATURE_KEY, IBidState } from './interfaces';

export const selectBid = createFeatureSelector<IBidState>(BID_FEATURE_KEY);

export const selectCurrentBid: MemoizedSelector<object, StoreState<IBid | null>> = createSelector(
  selectBid,
  (s: IBidState) => s.currentBid
);

export const selectSearchBid: MemoizedSelector<object, StoreState<IBid | null>> = createSelector(
  selectBid,
  (s: IBidState) => s.searchBid
);

export const selectBidders: MemoizedSelector<object, StoreState<IBidOffer[]>> = createSelector(
  selectBid,
  (s: IBidState) => s.bidders
);

export const selectHighestBid: MemoizedSelector<object, number | null> = createSelector(
  selectSearchBid,
  (s: StoreState<IBid | null>) => s.data?.highestBid ?? null
);

export const selectBidContractAddress: MemoizedSelector<object, string | null> = createSelector(
  selectSearchBid,
  (s: StoreState<IBid | null>) => s.data?.conctractAddress ?? null
);

export const selectBidWidthdrawing: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectBid,
  (s: IBidState) => s.widthdrawing
);

export const selectBlockNumber: MemoizedSelector<
  object,
  string | null,
  (s1: StoreState<IBid | null>) => string | null
> = createSelector(selectSearchBid, (s: StoreState<IBid | null>) => s.data?.blockNumber ?? null);
