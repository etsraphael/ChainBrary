import { createAction, props } from '@ngrx/store';
import { IAuth } from 'src/app/shared/interfaces';

export const resetAuth = createAction('[Auth] Reset Auth');
export const setAuth = createAction('[Auth] Set Auth', props<{ payload: IAuth }>());
