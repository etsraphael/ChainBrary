import { createAction, props } from '@ngrx/store';
import { Vault } from '../../../shared/interfaces';

export const loadVaults = createAction('[Vaults] Load Vaults');
export const loadVaultsSuccess = createAction('[Vaults] Load Vaults Success', props<{ list: Vault[] }>());
export const loadVaultsFailure = createAction('[Vaults] Load Vaults Failure', props<{ message: string }>());

export const resetVaults = createAction('[Vaults] Reset Vaults');
