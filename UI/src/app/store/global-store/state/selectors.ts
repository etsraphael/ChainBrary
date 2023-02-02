import { createFeatureSelector } from '@ngrx/store';
import { GLOBAL_FEATURE_KEY, IGlobalState } from './interfaces';

export const selectAuth = createFeatureSelector<IGlobalState>(GLOBAL_FEATURE_KEY);
