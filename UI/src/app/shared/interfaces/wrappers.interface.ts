export interface StoreState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export interface ActionStoreProcessing {
  isLoading: boolean;
  errorMessage: string | null;
}
