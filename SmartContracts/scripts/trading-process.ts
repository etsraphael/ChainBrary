import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { routerContracts } from './constants';
import { QuotePayload, TradingPayload } from './interfaces';
import { getUniswapV3Quote } from './quote-uniswap';
import { getQuote } from './quote-request';

export async function startTrading(payload: TradingPayload): Promise<string | null> {
  try {
    // Check if the quote results are still valid
    const quote1: Promise<string | null> = getQuote(payload.quoteResult1);
    const quote2: Promise<string | null> = getQuote(payload.quoteResult2);

    // Prompt the profit if the trade is executed

    // Execute the trade if the user confirms

    return null;
  } catch (error) {
    return null;
  }
}
