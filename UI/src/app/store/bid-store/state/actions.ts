import { createAction, props } from '@ngrx/store';
import { IBid, IBidCreation, IBidOffer } from './../../../shared/interfaces/bid.interface';

export const createBid = createAction('[Bid] Create Bid', props<{ payload: IBidCreation }>());
export const createBidSuccess = createAction('[Bid] Create Bid Success', props<{ txn: string }>());
export const createBidFailure = createAction('[Bid] Create Bid Failure', props<{ message: string }>());

export const getBidByTxn = createAction('[Bid] Get Bid By Txn', props<{ txn: string }>());
export const getBidByContractAddress = createAction(
  '[Bid] Get Bid By Address Contract',
  props<{ contractAddress: string }>()
);
export const getBidSuccess = createAction('[Bid] Get Bid Success', props<{ payload: IBid }>());
export const getBidFailure = createAction('[Bid] Get Bid Failure', props<{ message: string }>());

export const placeBid = createAction('[Bid] Place Bid', props<{ amount: number }>());
export const placeBidSuccess = createAction(
  '[Bid] Place Bid Success',
  props<{ txn: string; contractAddress: string }>()
);
export const placeBidFailure = createAction('[Bid] Place Bid Failure', props<{ message: string }>());

export const biddersListCheck = createAction('[Bid] Bidders List Check');
export const biddersListCheckSuccess = createAction(
  '[Bid] Bidders List Check Success',
  props<{ bidders: IBidOffer[] }>()
);
export const biddersListCheckFailure = createAction('[Bid] Bidders List Check Failure', props<{ message: string }>());
