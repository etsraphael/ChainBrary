export interface StoreState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}
