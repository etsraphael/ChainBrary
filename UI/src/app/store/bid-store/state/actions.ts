import { createAction, props } from '@ngrx/store';
import { BidCreation } from 'src/app/shared/creations/bidCreation';

export const createBid = createAction('[Bid] Create Bid', props<{ payload: BidCreation }>());
export const createBidSuccess = createAction('[Bid] Create Bid Success', props<{ txn: string }>());
export const createBidFailure = createAction('[Bid] Create Bid Failure', props<{ message: string }>());
