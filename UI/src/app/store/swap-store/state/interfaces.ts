import {
  ActionStoreProcessing,
  BalanceAndAllowance,
  IPoolDetail,
  IToken,
  StoreState
} from '../../../shared/interfaces';

export const SWAP_FEATURE_KEY = 'swap';

export interface ISwapState {
  isSwapping: ActionStoreProcessing;
  searchPool: StoreState<IPoolDetail | null>;
  tokenSearch: StoreState<IToken | null>;
  token0Detail: StoreState<BalanceAndAllowance | null>;
  token1Detail: StoreState<BalanceAndAllowance | null>;
}

export interface SwapState {
  readonly [SWAP_FEATURE_KEY]: ISwapState;
}
