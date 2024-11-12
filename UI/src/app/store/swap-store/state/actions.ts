import { createAction, props } from '@ngrx/store';
import {
  IERC20TokenAndBalanceResponse,
  ILiquidityPayload,
  IPoolDetail,
  IPoolSearch,
  QuotePayload
} from '../../../shared/interfaces';
import { NetworkChainId } from '@chainbrary/web3-login';

export const createPoolAction = createAction('[Swap] Create Pool Actions', props<{ payload: ILiquidityPayload }>());
export const createPoolActionSuccess = createAction(
  '[Swap] Create Pool Actions Success',
  props<{ result: IPoolDetail }>()
);
export const createPoolActionFailure = createAction('[Swap] Create Pool Actions Failure', props<{ message: string }>());

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
export const loadPoolActionSuccess = createAction('[Swap] Load Pool Actions Success', props<{ result: IPoolDetail }>());
export const loadPoolActionFailure = createAction('[Swap] Load Pool Actions Failure', props<{ message: string }>());

export const removeLiquidityAction = createAction(
  '[Swap] Remove Liquidity Actions',
  props<{ payload: ILiquidityPayload }>()
);
export const removeLiquidityActionSuccess = createAction(
  '[Swap] Remove Liquidity Actions Success', // TODO: Add type here
  props<{ message: string }>()
);
export const removeLiquidityActionFailure = createAction(
  '[Swap] Remove Liquidity Actions Failure',
  props<{ message: string }>()
);

export const resetSwapAction = createAction('[Swap] Reset Swap Actions');

export const lookUpTokenAction = createAction(
  '[Swap] Look Up Token Actions',
  props<{ address: string; chainId: NetworkChainId; tokenIn: boolean }>()
);
export const lookUpTokenActionSuccess = createAction(
  '[Swap] Look Up Token Actions Success',
  props<{ result: IERC20TokenAndBalanceResponse }>()
);
export const lookUpTokenActionFailure = createAction(
  '[Swap] Look Up Token Actions Failure',
  props<{ message: string; tokenIn: boolean }>()
);
