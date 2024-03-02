import { IVaultsState } from './interfaces';

export const initialState: IVaultsState = {
  vaultList: {
    data: [],
    loading: false,
    error: null
  },
  errorMessage: null
};
