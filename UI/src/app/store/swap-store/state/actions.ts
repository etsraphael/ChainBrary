import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { createAction, props } from '@ngrx/store';
import {
  BalanceAndAllowance,
  IBalanceAndAllowancePayload,
  ILiquidityPayload,
  IPoolDetail,
  IPoolDetailForm,
  IPoolSearch,
  IQuoteResult,
  ISwappingPayload,
  IToken,
  SwapPayload
} from '../../../shared/interfaces';

export const approveAllowanceAction = createAction(
  '[Swap] Approve Allowance Actions',
  props<{
    tokenAddress: string;
    chainId: NetworkChainId;
    amount: number;
    spender: string;
    tokenId: TokenId | string;
    view: 'liquidity' | 'swap';
  }>()
);
export const approveAllowanceActionSuccess = createAction(
  '[Swap] Approve Allowance Actions Success',
  props<{ tokenId: TokenId | string; tokenAddress: string; view: 'liquidity' | 'swap'; chainId: NetworkChainId }>()
);
export const approveAllowanceActionFailure = createAction(
  '[Swap] Approve Allowance Actions Failure',
  props<{ tokenAddress: string; message: string; view: 'liquidity' | 'swap' }>()
);

export const createPoolAction = createAction('[Swap] Create Pool Actions', props<{ payload: IPoolSearch }>());
export const createPoolActionSuccess = createAction(
  '[Swap] Create Pool Actions Success',
  props<{ result: IPoolDetail; hash: string; chainId: NetworkChainId }>()
);
export const createPoolActionFailure = createAction('[Swap] Create Pool Actions Failure', props<{ message: string }>());

export const addLiquidityAction = createAction('[Swap] Add Liquidity Actions', props<{ payload: ILiquidityPayload }>());
export const addLiquidityActionSuccess = createAction(
  '[Swap] Add Liquidity Actions Success',
  props<{ hash: string; chainId: NetworkChainId; token1Amount: number; token2Amount: number }>()
);
export const addLiquidityActionFailure = createAction(
  '[Swap] Add Liquidity Actions Failure',
  props<{ message: string }>()
);

export const swapAction = createAction('[Swap] Swap Actions', props<{ payload: ISwappingPayload }>());
export const swapActionSuccess = createAction(
  '[Swap] Swap Actions Success',
  props<{ hash: string; chainId: NetworkChainId }>()
);
export const swapActionFailure = createAction('[Swap] Swap Actions Failure', props<{ message: string }>());

export const loadQuoteAction = createAction('[Swap] Load Quote Actions', props<{ payload: SwapPayload }>());
export const loadQuoteActionSuccess = createAction(
  '[Swap] Load Quote Actions Success',
  props<{ result: IQuoteResult }>()
);
export const loadQuoteActionFailure = createAction('[Swap] Load Quote Actions Failure', props<{ message: string }>());

export const loadPoolAction = createAction('[Swap] Load Pool Actions', props<{ payload: IPoolSearch }>());
export const loadPoolActionSuccess = createAction('[Swap] Load Pool Actions Success', props<{ result: IPoolDetail }>());
export const loadPoolActionFailure = createAction('[Swap] Load Pool Actions Failure', props<{ message: string }>());

export const loadBalanceAndAllowanceAction = createAction(
  '[Swap] Load Balance and Allowance Actions',
  props<{ payload: IBalanceAndAllowancePayload }>()
);
export const loadBalanceAndAllowanceActionSuccess = createAction(
  '[Swap] Load Balance and Allowance Actions Success',
  props<{ result: BalanceAndAllowance }>()
);
export const loadBalanceAndAllowanceActionFailure = createAction(
  '[Swap] Load Balance and Allowance Actions Failure',
  props<{ message: string; tokenIn: boolean }>()
);

export const removeLiquidityAction = createAction(
  '[Swap] Remove Liquidity Actions',
  props<{ chainId: NetworkChainId }>()
);
export const removeLiquidityActionSuccess = createAction(
  '[Swap] Remove Liquidity Actions Success',
  props<{ hash: string; chainId: NetworkChainId }>()
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
  props<{ result: IToken }>()
);
export const lookUpTokenActionFailure = createAction(
  '[Swap] Look Up Token Actions Failure',
  props<{ message: string; tokenIn: boolean }>()
);

export const preloadLiquidityFormAction = createAction(
  '[Swap] Preload Liquidity Form Actions',
  props<{ payload: IPoolSearch }>()
);
export const preloadLiquidityFormActionSuccess = createAction(
  '[Swap] Preload Liquidity Form Actions Success',
  props<{ result: IPoolDetailForm }>()
);
export const preloadLiquidityFormActionFailure = createAction(
  '[Swap] Preload Liquidity Form Actions Failure',
  props<{ message: string }>()
);

export const loadAllowanceAfterApproveAllowanceSuccessFromLiquidity = createAction(
  '[Swap] Load Allowance After Approve Allowance Success From Liquidty',
  props<{ tokenId: TokenId | string; tokenAddress: string; chainId: NetworkChainId }>()
);
export const loadAllowanceAfterApproveAllowanceSuccessFromSwap = createAction(
  '[Swap] Load Allowance After Approve Allowance Success From Swap',
  props<{ tokenId: TokenId | string; tokenAddress: string; chainId: NetworkChainId }>()
);

export const loadLiquidityBalanceCheckAction = createAction(
  '[Swap] Load Liquidity Balance Check Actions',
  props<{ pool: IPoolDetail }>()
);
export const loadLiquidityBalanceCheckActionSuccess = createAction(
  '[Swap] Load Liquidity Balance Check Actions Success',
  props<{ result: number[] }>()
);
export const loadLiquidityBalanceCheckActionFailure = createAction(
  '[Swap] Load Liquidity Balance Check Actions Failure',
  props<{ message: string }>()
);
