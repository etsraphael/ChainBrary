import { ActionStoreProcessing, StoreState } from '../../../shared/interfaces';
import { IBid, IBidOffer } from './../../../shared/interfaces/bid.interface';

export const BID_FEATURE_KEY = 'bid';

export interface IBidState {
  bidCreation: StoreState<IBid | null>;
  bidRefreshCheck: StoreState<{ attempt: number }>;
  searchBid: StoreState<IBid | null>;
  bidders: StoreState<IBidOffer[]>;
  widthdrawing: ActionStoreProcessing;
}

export interface BidState {
  readonly [BID_FEATURE_KEY]: IBidState;
}
