import { createFeatureSelector } from '@ngrx/store';
import { GLOBAL_FEATURE_KEY, IGlobalState } from './interfaces';

export const selectGlobal = createFeatureSelector<IGlobalState>(GLOBAL_FEATURE_KEY);
