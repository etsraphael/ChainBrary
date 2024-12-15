import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  ActionStoreProcessing,
  BalanceAndAllowance,
  IPoolDetail,
  IQuoteResult,
  IToken,
  StoreState
} from '../../../shared/interfaces';
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

export const selectPoolContractAddress: MemoizedSelector<object, string | null> = createSelector(
  selectPoolDetail,
  (s: StoreState<IPoolDetail | null>) => s.data?.contractAddress || null
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

export const selectIsPoolCreating: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.isPoolCreating
);

export const selectLiquidityApproval: MemoizedSelector<object, ActionStoreProcessing[]> = createSelector(
  selectSwapState,
  (s: ISwapState) => [s.liquidityApproval.token0, s.liquidityApproval.token1]
);

export const selectSwapApproval: MemoizedSelector<object, ActionStoreProcessing[]> = createSelector(
  selectSwapState,
  (s: ISwapState) => [s.swapApproval.token0, s.swapApproval.token1]
);

export const selectIsAddingLiquidity: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.isAddingLiquidity
);

export const selectIsSwapping: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.isSwapping
);

export const selectIsRemovingLiquidity: MemoizedSelector<object, ActionStoreProcessing> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.isRemovingLiquidity
);

export const selectRemoveLiquidityIsAvailable: MemoizedSelector<object, boolean> = createSelector(
  selectSwapState,
  (s: ISwapState) => (s.liquidityBalance.data?.[0] ?? 0) > 0 && (s.liquidityBalance.data?.[1] ?? 0) > 0
);

export const selectLiquidityBalance: MemoizedSelector<object, number[]> = createSelector(
  selectSwapState,
  (s: ISwapState) => s.liquidityBalance.data ?? [0, 0]
);
