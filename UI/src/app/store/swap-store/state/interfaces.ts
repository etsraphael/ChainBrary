import { ActionStoreProcessing, StoreState } from '../../../shared/interfaces';

export const SWAP_FEATURE_KEY = 'swap';

export interface ISwapState {
  isSwapping: ActionStoreProcessing;
  searchPool: StoreState<null>; // TODO: Define the type of the data soon
}

export interface SwapState {
  readonly [SWAP_FEATURE_KEY]: ISwapState;
}
