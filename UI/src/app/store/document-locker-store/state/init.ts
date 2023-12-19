import { IDocumentLockerState } from './interfaces';

export const initialState: IDocumentLockerState = {
  dlCreation: {
    loading: false,
    error: null,
    data: null
  },
  dlRefreshCheck: {
    loading: false,
    error: null,
    data: {
      attempt: 0
    }
  },
  searchDocumentLocked: {
    loading: false,
    error: null,
    data: null
  },
  unlocking: {
    isLoading: false,
    errorMessage: null
  }
};
