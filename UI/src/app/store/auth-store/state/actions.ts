import { createAction, props } from '@ngrx/store';
import { ProfileCreation } from '../../../shared/creations/profileCreation';
import { IProfileAdded } from '../../../shared/interfaces';

export const setAuthPublicAddress = createAction('[Auth] Set Auth Public Address', props<{ publicAddress: string }>());
export const addressChecking = createAction('[Auth] Address Checking');

export const loadAuth = createAction('[Auth] Load Auth');
export const loadAuthSuccess = createAction('[Auth] Load Auth Success', props<{ auth: IProfileAdded }>());
export const loadAuthFailure = createAction('[Auth] Load Auth Failure', props<{ message: string }>());

export const editAccount = createAction('[Auth] Edit Account', props<{ account: ProfileCreation }>());
export const editAccountSuccess = createAction('[Auth] Edit Account Success');
export const editAccountFailure = createAction('[Auth] Edit Account Failure', props<{ message: string }>());

export const addAccount = createAction('[Auth] Add Account', props<{ account: ProfileCreation }>());
export const addAccountSuccess = createAction('[Auth] Add Account Success');
export const addAccountFailure = createAction('[Auth] Add Account Failure', props<{ message: string }>());

export const deleteAccount = createAction('[Auth] Delete Account');
export const deleteAccountSuccess = createAction('[Auth] Delete Account Success');
export const deleteAccountFailure = createAction('[Auth] Delete Account Failure', props<{ message: string }>());

export const resetAuth = createAction('[Auth] Reset Auth');
