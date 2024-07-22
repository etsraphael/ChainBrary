import { ITokenManagementState } from './interfaces';

export const initialState: ITokenManagementState = {
  balance: {
    data: null,
    loading: false,
    error: null
  },
  tokenCreationIsProcessing: {
    isLoading: false,
    errorMessage: null
  },
  tokenRefreshCheck: {
    data: { attempt: 0 },
    loading: false,
    error: null
  },
  tokenDetail: {
    data: null,
    loading: false,
    error: null
  }
};
