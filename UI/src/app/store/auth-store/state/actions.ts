import { createAction, props } from '@ngrx/store';
import { IProfileAdded } from '../../../shared/interfaces';

export const setAuthPublicAddress = createAction('[Auth] Set Auth Public Address', props<{ publicAddress: string }>());
export const addressChecking = createAction('[Auth] Address Checking');

export const loadAuth = createAction('[Auth] Load Auth');
export const loadAuthSuccess = createAction('[Auth] Load Auth Success', props<{ auth: IProfileAdded }>());
export const loadAuthFailure = createAction('[Auth] Load Auth Failure', props<{ message: string }>());

export const resetAuth = createAction('[Auth] Reset Auth');
