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
    SwapActions.createPoolAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      isPoolCreating: {
        isLoading: true,
        errorMessage: null
      }
    })
  ),
  on(
    SwapActions.createPoolActionSuccess,
    (state: ISwapState, action: { result: IPoolDetail }): ISwapState => ({
      ...state,
      searchPool: {
        data: action.result,
        loading: false,
        error: null
      },
      isPoolCreating: {
        isLoading: false,
        errorMessage: null
      }
    })
  ),
  on(
    SwapActions.createPoolActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      searchPool: {
        data: null,
        loading: false,
        error: message
      },
      isPoolCreating: {
        isLoading: false,
        errorMessage: message
      }
    })
  ),
  on(
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
          contractAddress: result.poolId as string,
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
        error: result?.poolId ? null : 'Pool_not_found'
      }
    })
  ),
  on(SwapActions.approveAllowanceAction, (state: ISwapState, action): ISwapState => {
    const { tokenAddress, view } = action;
    const { token1Address, token2Address } = state.searchPool.data || {};

    const isToken0: boolean = tokenAddress === token1Address;
    const isToken1: boolean = tokenAddress === token2Address;

    const approvalType = view === 'liquidity' ? 'liquidityApproval' : 'swapApproval';
    const tokenKey = isToken0 ? 'token0' : isToken1 ? 'token1' : 'token0';

    return {
      ...state,
      [approvalType]: {
        ...state[approvalType],
        [tokenKey]: {
          isLoading: true,
          errorMessage: null
        }
      }
    };
  }),
  on(SwapActions.approveAllowanceActionSuccess, (state: ISwapState, action): ISwapState => {
    const { tokenAddress, view } = action;
    const { token1Address, token2Address } = state.searchPool.data || {};

    const isToken0: boolean = tokenAddress === token1Address;
    const isToken1: boolean = tokenAddress === token2Address;

    const approvalType = view === 'liquidity' ? 'liquidityApproval' : 'swapApproval';
    const tokenKey = isToken0 ? 'token0' : isToken1 ? 'token1' : 'token0';

    return {
      ...state,
      [approvalType]: {
        ...state[approvalType],
        [tokenKey]: {
          isLoading: false,
          errorMessage: null
        }
      }
    };
  }),
  on(SwapActions.approveAllowanceActionFailure, (state: ISwapState, action): ISwapState => {
    const { tokenAddress, view, message } = action;
    const { token1Address, token2Address } = state.searchPool.data || {};

    const isToken0: boolean = tokenAddress === token1Address;
    const isToken1: boolean = tokenAddress === token2Address;

    const approvalType = view === 'liquidity' ? 'liquidityApproval' : 'swapApproval';
    const tokenKey = isToken0 ? 'token0' : isToken1 ? 'token1' : 'token0';

    return {
      ...state,
      [approvalType]: {
        ...state[approvalType],
        [tokenKey]: {
          isLoading: false,
          errorMessage: message
        }
      }
    };
  }),
  on(
    SwapActions.addLiquidityAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      isAddingLiquidity: {
        isLoading: true,
        errorMessage: null
      }
    })
  ),
  on(
    SwapActions.addLiquidityActionSuccess,
    (state: ISwapState, action): ISwapState => ({
      ...state,
      isAddingLiquidity: {
        isLoading: false,
        errorMessage: null
      },
      token0Detail: {
        ...state.token0Detail,
        data: {
          ...(state.token0Detail.data as BalanceAndAllowance),
          balance: state.token0Detail.data
            ? (parseFloat(state.token0Detail.data.balance) - action.token1Amount).toString()
            : '0',
          allowance: state.token0Detail.data
            ? (parseFloat(state.token0Detail.data.allowance) - action.token1Amount).toString()
            : '0'
        }
      },
      token1Detail: {
        ...state.token1Detail,
        data: {
          ...(state.token1Detail.data as BalanceAndAllowance),
          balance: state.token1Detail.data
            ? (parseFloat(state.token1Detail.data.balance) - action.token2Amount).toString()
            : '0',
          allowance: state.token1Detail.data
            ? (parseFloat(state.token1Detail.data.allowance) - action.token2Amount).toString()
            : '0'
        }
      }
    })
  ),
  on(
    SwapActions.addLiquidityActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      isAddingLiquidity: {
        isLoading: false,
        errorMessage: message
      }
    })
  ),
  on(
    SwapActions.swapAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      isSwapping: {
        isLoading: true,
        errorMessage: null
      }
    })
  ),
  on(
    SwapActions.swapActionSuccess,
    (state: ISwapState): ISwapState => ({
      ...state,
      isSwapping: {
        isLoading: false,
        errorMessage: null
      }
    })
  ),
  on(
    SwapActions.swapActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      isSwapping: {
        isLoading: false,
        errorMessage: message
      }
    })
  ),
  on(
    SwapActions.loadLiquidityBalanceCheckAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      liquidityBalance: {
        data: null,
        loading: true,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadLiquidityBalanceCheckActionSuccess,
    (state: ISwapState, { result }): ISwapState => ({
      ...state,
      liquidityBalance: {
        data: result,
        loading: false,
        error: null
      }
    })
  ),
  on(
    SwapActions.loadLiquidityBalanceCheckActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      liquidityBalance: {
        data: null,
        loading: false,
        error: message
      }
    })
  ),
  on(
    SwapActions.removeLiquidityAction,
    (state: ISwapState): ISwapState => ({
      ...state,
      isRemovingLiquidity: {
        isLoading: true,
        errorMessage: null
      }
    })
  ),
  on(
    SwapActions.removeLiquidityActionSuccess,
    (state: ISwapState): ISwapState => ({
      ...state,
      isRemovingLiquidity: {
        isLoading: false,
        errorMessage: null
      }
    })
  ),
  on(
    SwapActions.removeLiquidityActionFailure,
    (state: ISwapState, { message }): ISwapState => ({
      ...state,
      isRemovingLiquidity: {
        isLoading: false,
        errorMessage: message
      }
    })
  )
);

export function reducer(state: ISwapState = initialState, action: Action): ISwapState {
  return authReducer(state, action);
}
