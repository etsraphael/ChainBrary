import { Token } from '@uniswap/sdk-core';

// export interface QuoteResult {
//   tokenIn: Token;
//   tokenOut: Token;
//   network: pair.network.name,
//   dex: DEX,
// }

export enum DEX {
  UNISWAP = 'Uniswap',
  SUSHISWAP = 'SushiSwap',
  PANCAKESWAP = 'PancakeSwap'
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
}
