import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { BalanceAndAllowance, IBalanceAndAllowancePayload, IPoolDetail } from '../../../shared/interfaces';
import * as SwapActions from './actions';
import { initialState } from './init';
import { ISwapState } from './interfaces';

export const authReducer: ActionReducer<ISwapState, Action> = createReducer(
  initialState,
  on(SwapActions.resetSwapAction, (): ISwapState => initialState),
  on(
    SwapActions.loadPoolAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      searchPool: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    SwapActions.createPoolActionSuccess,
    SwapActions.loadPoolActionSuccess,
    (state: ISwapState, action: { result: IPoolDetail }): ISwapState => ({
      ...state,
      searchPool: {
        data: action.result,
        loading: false,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadPoolActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      searchPool: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    SwapActions.lookUpTokenAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      tokenSearch: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    SwapActions.lookUpTokenActionSuccess,
    (state: ISwapState, action): ISwapState => ({
      ...state,
      tokenSearch: {
        data: action.result,
        loading: false,
        error: null
      }
    })
  ),
  on(
    SwapActions.lookUpTokenActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      tokenSearch: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    SwapActions.loadBalanceAndAllowanceAction,
    (state: ISwapState, action: { payload: IBalanceAndAllowancePayload }): ISwapState => ({
      ...state,
      [action.payload.tokenIn ? 'token0Detail' : 'token1Detail']: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadBalanceAndAllowanceActionSuccess,
    (state: ISwapState, action: { result: BalanceAndAllowance }): ISwapState => ({
      ...state,
      [action.result.tokenIn ? 'token0Detail' : 'token1Detail']: {
        data: action.result,
        loading: false,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadBalanceAndAllowanceActionFailure,
    (state: ISwapState, { message, tokenIn }): ISwapState => ({
      ...state,
      [tokenIn ? 'token0Detail' : 'token1Detail']: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    SwapActions.loadQuoteAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      quote: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadQuoteActionSuccess,
    (state: ISwapState, action): ISwapState => ({
      ...state,
      quote: {
        data: action.result,
        loading: false,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadQuoteActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      quote: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    SwapActions.preloadLiquidityFormActionSuccess,
    (state: ISwapState, { result }): ISwapState => ({
      ...state,
      searchPool: {
        data: {
          id: result.poolId as string,
          token1Address: result.token1.networkSupport.find((tokenContract) => tokenContract.chainId === result.chainId)
            ?.address as string,
          token2Address: result.token2.networkSupport.find((tokenContract) => tokenContract.chainId === result.chainId)
            ?.address as string,
          fee: result.fee,
          token1Amount: result.token1Amount,
          token2Amount: result.token2Amount,
          chainId: result.chainId
        },
        loading: false,
        error: null
      }
    })
  )
);

export function reducer(state: ISwapState = initialState, action: Action): ISwapState {
  return authReducer(state, action);
}
