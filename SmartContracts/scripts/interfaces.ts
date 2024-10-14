import { Token } from '@uniswap/sdk-core';

export interface TradingPayload {
  quoteResult1: QuotePayload;
  quoteResult2: QuotePayload;
  profit: number;
}

export interface QuoteResult {
  amountIn: string;
  tokenIn: Token;
  tokenOut: Token;
  network: INetwork;
  dex: DEX;
  quoteResult: string | null;
}

export interface QuotePayload {
  tokenIn: Token;
  tokenOut: Token;
  networkUrl: string;
  amountInRaw: string;
  fee: number;
  dex: DEX;
}

export enum NetworkNameList {
  POLYGON_MAINNET = 'POLYGON_MAINNET',
  BSC_MAINNET = 'BSC_MAINNET',
  ETH_MAINNET = 'ETH_MAINNET',
  ARBITRUM_MAINNET = 'ARBITRUM_MAINNET'
}

export interface INetwork {
  chainId: number;
  rpcUrl: string;
  networkName: NetworkNameList;
}

export enum DEX {
  UNISWAP_V3 = 'Uniswap_v3',
  PANCAKESWAP_V3 = 'PancakeSwap_v3'
}

export interface IDexPool {
  network: INetwork;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  fee: number;
  dex: DEX;
}

export enum UniswapFee {
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000
}
