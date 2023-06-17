import { createAction, props } from '@ngrx/store';
import { ProfileCreation } from '../../../shared/creations/profileCreation';
import { IOrganization, IProfileAdded } from '../../../shared/interfaces';
import { INetworkDetail } from '@chainbrary/web3-login';

export const setAuthPublicAddress = createAction(
  '[Auth] Set Auth Public Address',
  props<{ publicAddress: string; network: INetworkDetail }>()
);
export const addressChecking = createAction('[Auth] Address Checking');

export const loadAuth = createAction('[Auth] Load Auth');
export const loadAuthSuccess = createAction('[Auth] Load Auth Success', props<{ auth: IProfileAdded }>());
export const loadAuthFailure = createAction('[Auth] Load Auth Failure', props<{ message: string }>());

export const editAccountSent = createAction(
  '[Auth] Edit Account Sent',
  props<{ account: ProfileCreation; hash: string; networkId: number }>()
);
export const editAccountSuccess = createAction(
  '[Auth] Edit Account Success',
  props<{ hash: string; numberConfirmation: number }>()
);
export const editAccountFailure = createAction('[Auth] Edit Account Failure', props<{ message: string }>());

export const addAccountSent = createAction(
  '[Auth] Add Account Sent',
  props<{ account: ProfileCreation; hash: string; networkId: number }>()
);
export const addAccountSuccess = createAction(
  '[Auth] Add Account Success',
  props<{ hash: string; numberConfirmation: number }>()
);
export const addAccountFailure = createAction('[Auth] Add Account Failure', props<{ message: string }>());

export const deleteAccountSent = createAction(
  '[Auth] Delete Account Sent',
  props<{ hash: string; networkId: number }>()
);
export const deleteAccountSuccess = createAction(
  '[Auth] Delete Account Success',
  props<{ hash: string; numberConfirmation: number }>()
);
export const deleteAccountFailure = createAction('[Auth] Delete Account Failure', props<{ message: string }>());

export const loadOrgnisationSuccess = createAction(
  '[Auth] Load Orgnisations Success',
  props<{ organization: IOrganization }>()
);

export const networkChanged = createAction('[Auth] Network Changed', props<{ network: INetworkDetail }>());

export const accountChanged = createAction('[Auth] Account Changed', props<{ publicAddress: string | null }>());

export const resetAuth = createAction('[Auth] Reset Auth');
