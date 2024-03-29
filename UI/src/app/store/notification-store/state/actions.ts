import { createAction, props } from '@ngrx/store';

export const showSuccessNotification = createAction('[Notification] Success snackbar', props<{ message: string }>());
export const showErrorNotification = createAction('[Notification] Failure snackbar', props<{ message: string }>());

export const showLoadingScreen = createAction('[Notification] Show loading screen');
export const hideLoadingScreen = createAction('[Notification] Hide loading screen');
