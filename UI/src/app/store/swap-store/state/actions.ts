import { createAction, props } from '@ngrx/store';
import { ILiquidityPayload, IPoolSearch, QuotePayload } from '../../../shared/interfaces';

export const addLiquidityAction = createAction('[Swap] Add Liquidity Actions', props<{ payload: ILiquidityPayload }>());
export const addLiquidityActionSuccess = createAction(
  '[Swap] Add Liquidity Actions Success',
  props<{ message: string }>()
);
export const addLiquidityActionFailure = createAction(
  '[Swap] Add Liquidity Actions Failure',
  props<{ message: string }>()
);

export const swapAction = createAction('[Swap] Swap Actions', props<{ payload: QuotePayload }>());
export const swapActionSuccess = createAction('[Swap] Swap Actions Success', props<{ message: string }>());
export const swapActionFailure = createAction('[Swap] Swap Actions Failure', props<{ message: string }>());

export const loadQuoteAction = createAction('[Swap] Load Quote Actions', props<{ action: string }>());
export const loadQuoteActionSuccess = createAction('[Swap] Load Quote Actions Success', props<{ message: string }>());
export const loadQuoteActionFailure = createAction('[Swap] Load Quote Actions Failure', props<{ message: string }>());

export const loadPoolAction = createAction('[Swap] Load Pool Actions', props<{ payload: IPoolSearch }>());
export const loadPoolActionSuccess = createAction('[Swap] Load Pool Actions Success', props<{ message: string }>()); // TODO: Add type here
export const loadPoolActionFailure = createAction('[Swap] Load Pool Actions Failure', props<{ message: string }>());

export const resetSwapAction = createAction('[Swap] Reset Swap Actions');
