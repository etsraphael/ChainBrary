import { createAction, props } from '@ngrx/store';

export const showSuccessNotification = createAction('[Auth] Reset Auth', props<{ message: string }>());

export const showErrorNotification = createAction('[Auth] Reset Auth', props<{ message: string }>());
