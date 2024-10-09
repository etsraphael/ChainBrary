import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { routerContracts } from './constants';
import { QuotePayload, TradingPayload } from './interfaces';
import { getUniswapV3Quote } from './quote-uniswap';
import { getQuote } from './quote-request';
import inquirer from 'inquirer';

export async function startTrading(payload: TradingPayload): Promise<string | null> {
  try {
    // Check if the quote results are still valid
    const isTradeAccepted: boolean = await checkProfitChecking(payload);
    if (!isTradeAccepted) {
      console.log('The trade has been cancelled');
      return null;
    }

    // Prompt the profit if the trade is executed

    // Execute the trade if the user confirms

    return null;
  } catch (error) {
    return null;
  }
}

async function checkProfitChecking(payload: TradingPayload): Promise<boolean> {
  // const quote1: string | null = await getQuote(payload.quoteResult1);
  // const quote2: string | null = await getQuote(payload.quoteResult2);
  const quote1 = '2600';
  const quote2 = '2905';

  if (quote1 === null || quote2 === null) {
    console.log('The quotes are no longer valid.');
    return false;
  }

  const profit: number = ((Number(quote2) - Number(quote1)) / Number(quote1)) * 100;
  console.log(`Old Profit: ${payload.profit.toFixed(2)}%`);
  console.log(`New Profit: ${profit.toFixed(2)}%`);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Do you want to execute the trade? The latest profit calculated is ${profit.toFixed(2)}%`,
      default: false
    }
  ]);

  return confirm;
}
