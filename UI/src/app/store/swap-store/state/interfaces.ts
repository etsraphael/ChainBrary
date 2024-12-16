import {
  ActionStoreProcessing,
  BalanceAndAllowance,
  IPoolDetail,
  IQuoteResult,
  IToken,
  StoreState
} from '../../../shared/interfaces';

export const SWAP_FEATURE_KEY = 'swap';

export interface ISwapState {
  isSwapping: ActionStoreProcessing;
  isPoolCreating: ActionStoreProcessing;
  isAddingLiquidity: ActionStoreProcessing;
  isRemovingLiquidity: ActionStoreProcessing;
  searchPool: StoreState<IPoolDetail | null>;
  liquidityBalance: StoreState<number[] | null>;
  tokenSearch: StoreState<IToken | null>;
  token0Detail: StoreState<BalanceAndAllowance | null>;
  token1Detail: StoreState<BalanceAndAllowance | null>;
  quote: StoreState<IQuoteResult | null>;
  liquidityApproval: {
    token0: ActionStoreProcessing;
    token1: ActionStoreProcessing;
  };
  swapApproval: {
    token0: ActionStoreProcessing;
    token1: ActionStoreProcessing;
  };
}

export interface SwapState {
  readonly [SWAP_FEATURE_KEY]: ISwapState;
}
