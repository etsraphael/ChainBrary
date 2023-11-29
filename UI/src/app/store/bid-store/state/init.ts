import { IBidState } from './interfaces';

export const initialState: IBidState = {
  bidCreation: {
    loading: false,
    error: null,
    data: null
  },
  bidRefreshCheck: {
    loading: false,
    error: null,
    data: {
      attempt: 0
    }
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
