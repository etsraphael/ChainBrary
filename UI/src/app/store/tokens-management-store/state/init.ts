import { ITokenManagementState } from './interfaces';

export const initialState: ITokenManagementState = {
  tokenCreation: {
    isLoading: false,
    errorMessage: null
  },
  tokenRefreshCheck: {
    data: { attempt: 0 },
    loading: false,
    error: null
  }
};
