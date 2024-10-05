import { Token } from "@uniswap/sdk-core";



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