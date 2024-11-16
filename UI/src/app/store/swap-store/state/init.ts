import { ISwapState } from './interfaces';

export const initialState: ISwapState = {
  isSwapping: {
    isLoading: false,
    errorMessage: null
  },
  searchPool: {
    data: null,
    loading: false,
    error: null
  },
  tokenSearch: {
    data: null,
    loading: false,
    error: null
  },
  token0Detail: {
    data: null,
    loading: false,
    error: null
  },
  token1Detail: {
    data: null,
    loading: false,
    error: null
  },
  quote: {
    data: null,
    loading: false,
    error: null
  }
};
