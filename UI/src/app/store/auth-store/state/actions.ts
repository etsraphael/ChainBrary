import { createAction, props } from '@ngrx/store';
import { IOrganization, IProfileAdded } from '../../../shared/interfaces';
import { INetworkDetail, WalletProvider } from '@chainbrary/web3-login';

export const setAuthPublicAddress = createAction(
  '[Auth] Set Auth Public Address',
  props<{ publicAddress: string; network: INetworkDetail; wallet: WalletProvider }>()
);
export const addressChecking = createAction('[Auth] Address Checking');
export const saveBalance = createAction('[Auth] Save Balance', props<{ balance: number }>());
export const walletError = createAction('[Wallet] Error Request', props<{ code: number; message: string }>());

export const loadAuth = createAction('[Auth] Load Auth');
export const loadAuthSuccess = createAction('[Auth] Load Auth Success', props<{ auth: IProfileAdded }>());
export const loadAuthFailure = createAction('[Auth] Load Auth Failure', props<{ message: string }>());

export const deleteAccountSent = createAction('[Auth] Delete Account Sent', props<{ hash: string; chainId: number }>());
export const deleteAccountSuccess = createAction(
  '[Auth] Delete Account Success',
  props<{ hash: string; numberConfirmation: number }>()
);
export const deleteAccountFailure = createAction('[Auth] Delete Account Failure', props<{ message: string }>());

export const loadOrgnisationSuccess = createAction(
  '[Auth] Load Orgnisations Success',
  props<{ organization: IOrganization }>()
);

export const networkChange = createAction('[Auth] Network Change', props<{ network: INetworkDetail }>());

export const networkChangeSuccess = createAction('[Auth] Network Change Success', props<{ network: INetworkDetail }>());

export const networkChangeSuccessOutside = createAction('[Auth] Network Change Success Outside');

export const networkChangeFailure = createAction('[Auth] Network Change Failure', props<{ message: string }>());

export const addNetworkToWallet = createAction('[Auth] Add Network To Wallet', props<{ network: INetworkDetail }>());

export const addNetworkToWalletSuccess = createAction(
  '[Auth] Add Network To Wallet Success',
  props<{ network: INetworkDetail }>()
);

export const addNetworkToWalletFailure = createAction(
  '[Auth] Add Network To Wallet Failure',
  props<{ message: string }>()
);

export const accountChanged = createAction('[Auth] Account Changed', props<{ publicAddress: string | null }>());

export const resetAuth = createAction('[Auth] Reset Auth');
