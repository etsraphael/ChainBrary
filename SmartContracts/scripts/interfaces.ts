import { Token } from '@uniswap/sdk-core';

export interface TradingPayload {
  quoteResult1: QuoteResult;
  quoteResult2: QuoteResult;
  profit: number;
  profitAmount: number;
}

export interface QuoteResult {
  amountIn: string;
  amountOut: string;
  tokenIn: Token;
  tokenOut: Token;
  network: INetwork;
  dex: DEX;
  fee: number;
  type: 'BUY' | 'SELL';
  relatedBuyQuote?: QuoteResult;
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
  type: 'BUY' | 'SELL';
}

export enum UniswapFee {
  LOW = 100,
  MEDIUM = 500,
  HIGH = 3000
  // SUPER_HIGH = 10000
}
