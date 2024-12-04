import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { BalanceAndAllowance, IPoolDetail, IQuoteResult, IToken, StoreState } from '../../../shared/interfaces';
import { ISwapState, SWAP_FEATURE_KEY } from './interfaces';

export const selectSwapState = createFeatureSelector<ISwapState>(SWAP_FEATURE_KEY);

export const selectPoolIsNotCreated: MemoizedSelector<object, boolean> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.searchPool.error === 'Pool_not_found'
);

export const selectPoolDetail: MemoizedSelector<object, StoreState<IPoolDetail | null>> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.searchPool
);

export const selectTokenSearch: MemoizedSelector<object, StoreState<IToken | null>> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.tokenSearch
);

export const selectTokensDetails: MemoizedSelector<object, StoreState<BalanceAndAllowance | null>[]> = createSelector(
  selectSwapState,
  (s: ISwapState) => [s.token0Detail, s.token1Detail]
);

export const selectQuote: MemoizedSelector<object, StoreState<IQuoteResult | null>> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.quote
);

export const selectIsPoolCreating: MemoizedSelector<object, boolean> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.isPoolCreating.isLoading
);
