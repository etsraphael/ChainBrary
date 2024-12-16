import { NetworkChainId } from '@chainbrary/web3-login';
import { IToken } from './token.interface';

export interface ISwappingPayload {
  chainId: NetworkChainId;
  amount: string;
  amountOutMin: string;
  path: string[];
  fees: number;
}

export interface SwapPayload {
  from: IToken;
  to: IToken;
  amount: string;
  slippage: string;
  deadline: string;
  chainId: NetworkChainId;
}

export interface ILiquidityPayload {
  token1: IToken;
  token2: IToken;
  token1Amount: number;
  token2Amount: number;
  chainId: NetworkChainId;
}

export interface IRemoveLiquidityPayload {
  poolAddress: string;
  liquidity: number;
  chainId: NetworkChainId;
}

export interface ILiquidityBalanceCheckPayload {
  from: string;
  poolAddress: string;
  chainId: NetworkChainId;
}

export interface IPoolSearch {
  token1Address: string;
  token2Address: string;
  chainId: NetworkChainId;
}

export interface IPoolDetail {
  contractAddress: string;
  token1Address: string;
  token2Address: string;
  fee: number;
  token1Amount: number;
  token2Amount: number;
  chainId: NetworkChainId;
}

export interface IPoolDetailForm {
  poolId: string | null;
  token1: IToken;
  token2: IToken;
  token1Amount: number;
  token2Amount: number;
  chainId: NetworkChainId;
  fee: number;
}

export interface IERC20TokenAndBalancePayload {
  chainId: NetworkChainId;
  tokenAddress: string;
  from: string;
}
