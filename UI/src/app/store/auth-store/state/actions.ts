import { createAction, props } from '@ngrx/store';
import { IProfileAdded } from '../../../shared/interfaces';

export const resetAuth = createAction('[Auth] Reset Auth');
export const loadAuth = createAction('[Auth] Load Auth');
export const loadAuthSuccess = createAction('[Auth] Load Auth Success', props<{ auth: IProfileAdded }>());
export const loadAuthFailure = createAction('[Auth] Load Auth Failure', props<{ message: string }>());
