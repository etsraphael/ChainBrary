import { NetworkChainId } from '@chainbrary/web3-login';
import { IToken } from './token.interface';

export interface QuotePayload {
  from: IToken;
  to: IToken;
  amount: string;
  slippage: string;
  deadline: string;
}

export interface SwapPayload {
  from: IToken;
  to: IToken;
  amount: string;
  slippage: string;
  deadline: string;
  recipient: string;
  chainId: NetworkChainId;
}

export interface ILiquidityPayload {
  token1: IToken;
  token2: IToken;
  token1Amount: number;
  token2Amount: number;
  chainId: NetworkChainId;
}

export interface IPoolSearch {
  token1Address: string;
  token2Address: string;
  chainId: NetworkChainId;
}

export interface IPoolDetail {
  id: string;
  token1Address: string;
  token2Address: string;
  token1Amount: number;
  token2Amount: number;
  chainId: NetworkChainId;
}
