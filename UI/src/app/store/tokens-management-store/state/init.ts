import { ITokenManagementState } from './interfaces';

export const initialState: ITokenManagementState = {
  tokenCreation: {
    isLoading: false,
    errorMessage: null
  }
};
