import { createAction, props } from '@ngrx/store';
import { BidCreation } from './../../../shared/creations/bidCreation';
import { IBid } from './../../../shared/interfaces/bid.interface';

export const createBid = createAction('[Bid] Create Bid', props<{ payload: BidCreation }>());
export const createBidSuccess = createAction('[Bid] Create Bid Success', props<{ txn: string }>());
export const createBidFailure = createAction('[Bid] Create Bid Failure', props<{ message: string }>());

export const getBidByTxn = createAction('[Bid] Get Bid By Txn', props<{ txn: string }>());
export const getBidByTxnSuccess = createAction('[Bid] Get Bid By Txn Success', props<{ bid: IBid }>());
export const getBidByTxnFailure = createAction('[Bid] Get Bid By Txn Failure', props<{ message: string }>());
