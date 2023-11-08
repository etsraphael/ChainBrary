import { IBidState } from './interfaces';

export const initialState: IBidState = {
  currentBid: {
    loading: false,
    error: null,
    data: null
  }
};
