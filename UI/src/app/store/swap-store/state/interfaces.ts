import { ActionStoreProcessing, IPoolDetail, StoreState } from '../../../shared/interfaces';

export const SWAP_FEATURE_KEY = 'swap';

export interface ISwapState {
  isSwapping: ActionStoreProcessing;
  searchPool: StoreState<IPoolDetail | null>;
}

export interface SwapState {
  readonly [SWAP_FEATURE_KEY]: ISwapState;
}
