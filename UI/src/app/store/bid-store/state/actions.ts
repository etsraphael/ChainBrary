import { createAction, props } from '@ngrx/store';
import { IBid, IBidCreation } from './../../../shared/interfaces/bid.interface';

export const createBid = createAction('[Bid] Create Bid', props<{ payload: IBidCreation }>());
export const createBidSuccess = createAction('[Bid] Create Bid Success', props<{ txn: string }>());
export const createBidFailure = createAction('[Bid] Create Bid Failure', props<{ message: string }>());

export const getBidByTxn = createAction('[Bid] Get Bid By Txn', props<{ txn: string }>());
export const getBidByTxnSuccess = createAction('[Bid] Get Bid By Txn Success', props<{ payload: IBid }>());
export const getBidByTxnFailure = createAction('[Bid] Get Bid By Txn Failure', props<{ message: string }>());

export const placeBid = createAction('[Bid] Place Bid', props<{ amount: number }>());
export const placeBidSuccess = createAction('[Bid] Place Bid Success', props<{ txn: string }>());
export const placeBidFailure = createAction('[Bid] Place Bid Failure', props<{ message: string }>());
