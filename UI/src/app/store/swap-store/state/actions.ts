import { createAction, props } from '@ngrx/store';
import { QuotePayload } from '../../../shared/interfaces';

export const swapAction = createAction('[Swap] Swap Actions', props<{ payload: QuotePayload }>());
export const swapActionSuccess = createAction('[Swap] Swap Actions Success', props<{ message: string }>());
export const swapActionFailure = createAction('[Swap] Swap Actions Failure', props<{ message: string }>());

export const loadQuoteAction = createAction('[Swap] Load Quote Actions', props<{ action: string }>());
export const loadQuoteActionSuccess = createAction('[Swap] Load Quote Actions Success', props<{ message: string }>());
export const loadQuoteActionFailure = createAction('[Swap] Load Quote Actions Failure', props<{ message: string }>());

export const resetSwapAction = createAction('[Swap] Reset Swap Actions');
