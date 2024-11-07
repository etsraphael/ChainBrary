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
  }
};
