import { Token } from '@uniswap/sdk-core';

export interface TradingPayload {
  quoteResult1: QuotePayload;
  quoteResult2: QuotePayload;
  profit: number;
}

export interface QuoteResult {
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

export enum DEX {
  UNISWAP_V3 = 'Uniswap_v3',
  SUSHISWAP_V2 = 'SushiSwap_v2',
  PANCAKESWAP_V2 = 'PancakeSwap_v2',
  PANCAKESWAP_V3 = 'PancakeSwap_v3'
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
  name: string;
  networkName: NetworkNameList;
}

export interface IQuotePayload {
  network: INetwork;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  fee: number;
}
