import { IBidState } from './interfaces';

export const initialState: IBidState = {
  bidCreation: {
    loading: false,
    error: null,
    data: null
  },
  searchBid: {
    loading: false,
    error: null,
    data: null
  },
  bidders: {
    loading: false,
    error: null,
    data: []
  },
  widthdrawing: {
    isLoading: false,
    errorMessage: null
  }
};
