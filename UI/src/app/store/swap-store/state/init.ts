import { ISwapState } from './interfaces';

export const initialState: ISwapState = {
  isSwapping: {
    isLoading: false,
    errorMessage: null
  },
  isPoolCreating: {
    isLoading: false,
    errorMessage: null
  },
  isAddingLiquidity: {
    isLoading: false,
    errorMessage: null
  },
  isRemovingLiquidity: {
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
  },
  liquidityApproval: {
    token0: {
      isLoading: false,
      errorMessage: null
    },
    token1: {
      isLoading: false,
      errorMessage: null
    }
  },
  swapApproval: {
    token0: {
      isLoading: false,
      errorMessage: null
    },
    token1: {
      isLoading: false,
      errorMessage: null
    }
  },
  liquidityBalance: {
    data: null,
    loading: false,
    error: null
  }
};
