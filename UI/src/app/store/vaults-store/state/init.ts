import { IVaultsState } from './interfaces';

export const initialState: IVaultsState = {
  vaultList: [],
  errorMessage: {
    withdrawing: null,
    staking: null
  }
};
