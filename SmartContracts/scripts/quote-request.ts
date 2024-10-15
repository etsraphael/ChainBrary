import { DEX, QuotePayload, QuoteResult } from './interfaces';
import { getUniswapV2Quote, getUniswapV3Quote } from './quote-uniswap';

// Function to get Uniswap quote
export async function getQuote(payload: QuotePayload): Promise<QuoteResult | null> {
  switch (payload.dex) {
    case DEX.UNISWAP_V3:
    case DEX.PANCAKESWAP_V3:
      return getUniswapV3Quote(payload);
    // case DEX.SUSHISWAP_V2:
    // case DEX.PANCAKESWAP_V2:
    //   return getUniswapV2Quote(payload);
    default:
      return null;
  }
}
