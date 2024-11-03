import { createFeatureSelector } from '@ngrx/store';
import { ISwapState, SWAP_FEATURE_KEY } from './interfaces';

export const selectSwapState = createFeatureSelector<ISwapState>(SWAP_FEATURE_KEY);
