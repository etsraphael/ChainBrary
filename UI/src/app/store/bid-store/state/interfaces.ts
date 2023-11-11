import { StoreState } from '../../../shared/interfaces';
import { IBid } from './../../../shared/interfaces/bid.interface';

export const BID_FEATURE_KEY = 'bid';

export interface IBidState {
  currentBid: StoreState<IBid | null>;
  searchBid: StoreState<IBid | null>;
}

export interface BidState {
  readonly [BID_FEATURE_KEY]: IBidState;
}
