import { createAction, props } from '@ngrx/store';
import { IAuth, IProfileAdded } from '../../../shared/interfaces';

export const resetAuth = createAction('[Auth] Reset Auth');
export const setAuth = createAction('[Auth] Set Auth', props<{ payload: IAuth }>());
export const loadAuth = createAction('[Auth] Load Auth');
export const loadAuthSuccess = createAction('[Auth] Load Auth Success', props<{ auth: IProfileAdded }>());
export const loadAuthFailure = createAction('[Auth] Load Auth Failure', props<{ message: string }>());
