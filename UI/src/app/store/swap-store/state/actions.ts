import { createAction, props } from '@ngrx/store';

export const swapActions = createAction('[Swap] Swap Actions', props<{ action: string }>());
export const swapActionsSuccess = createAction('[Swap] Swap Actions Success', props<{ message: string }>());
export const swapActionsFailure = createAction('[Swap] Swap Actions Failure', props<{ message: string }>());

export const loadQuoteActions = createAction('[Swap] Load Quote Actions', props<{ action: string }>());
export const loadQuoteActionsSuccess = createAction('[Swap] Load Quote Actions Success', props<{ message: string }>());
export const loadQuoteActionsFailure = createAction('[Swap] Load Quote Actions Failure', props<{ message: string }>());

export const resetSwapActions = createAction('[Swap] Reset Swap Actions');
