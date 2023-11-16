import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as BidActions from './actions';
import { initialState } from './init';
import { IBidState } from './interfaces';

export const authReducer: ActionReducer<IBidState, Action> = createReducer(
  initialState,
  on(
    BidActions.createBid,
    (state): IBidState => ({
      ...state,
      currentBid: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    BidActions.createBidFailure,
    (state, { message }): IBidState => ({
      ...state,
      currentBid: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    BidActions.createBidSuccess,
    (state): IBidState => ({
      ...state,
      currentBid: {
        data: null,
        loading: false,
        error: null
      }
    })
  ),
  on(
    BidActions.getBidByTxn,
    (state): IBidState => ({
      ...state,
      searchBid: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    BidActions.getBidSuccess,
    (state, { payload }): IBidState => ({
      ...state,
      searchBid: {
        data: payload,
        loading: false,
        error: null
      }
    })
  ),
  on(
    BidActions.getBidFailure,
    (state, { message }): IBidState => ({
      ...state,
      searchBid: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    BidActions.biddersListCheck,
    (state): IBidState => ({
      ...state,
      bidders: {
        data: state.bidders.data,
        loading: true,
        error: null
      }
    })
  ),
  on(
    BidActions.biddersListCheckSuccess,
    (state, { bidders }): IBidState => ({
      ...state,
      bidders: {
        data: bidders,
        loading: false,
        error: null
      }
    })
  ),
  on(
    BidActions.biddersListCheckFailure,
    (state, { message }): IBidState => ({
      ...state,
      bidders: {
        data: [],
        loading: false,
        error: message
      }
    })
  )
);

export function reducer(state: IBidState = initialState, action: Action): IBidState {
  return authReducer(state, action);
}
