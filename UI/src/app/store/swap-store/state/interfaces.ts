import { ActionStoreProcessing } from '../../../shared/interfaces';

export const SWAP_FEATURE_KEY = 'swap';

export interface ISwapState {
  isSwapping: ActionStoreProcessing;
}

export interface SwapState {
  readonly [SWAP_FEATURE_KEY]: ISwapState;
}
