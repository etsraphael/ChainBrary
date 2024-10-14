import cliProgress from 'cli-progress';
import { Table } from 'console-table-printer';
import {  TOKENS } from './constants';
import { DEX, IDexPool, NetworkNameList, QuotePayload, QuoteResult, TradingPayload } from './interfaces';
import inquirer from 'inquirer';
import { getQuote } from './quote-request';
import { Token } from '@uniswap/sdk-core';
import { startTrading } from './trading-process';
import path from 'path';
import fs from 'fs';

// Function to prompt the user to select a token to grow
async function selectTokenToGrow(): Promise<Token> {
  const allTokens = Object.values(TOKENS).flatMap((tokenMap) => Object.values(tokenMap));
  const tokenChoices = allTokens.map((token) => ({
    name: `${token.symbol} (${token.name}) on chain ${token.chainId}`,
    value: token
  }));

  const response = await inquirer.prompt([
    {
      type: 'list',
      name: 'token',
      message: 'Which token would you like to grow?',
      choices: tokenChoices
    }
  ]);

  return response.token;
}

// Load pools from the generated JSON file
function loadPools(): IDexPool[] {
  const filePath = path.resolve(__dirname, './generated-data/pool-listing.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData) as IDexPool[];
}


// Function to run quotes for all token pairs
async function runQuotes(): Promise<void> {
  // Prompt the user to select the token to grow
  // const selectedToken = await selectTokenToGrow();

  // get quotes and display
  const results: QuoteResult[] = await getQuotes();
  displayResults(results);

  // check profitability
  const profitableResult: TradingPayload[] = checkProfitability(results);
  if (profitableResult.length === 0) {
    console.log('No profitable trades found.');
    return;
  }

  console.log(JSON.stringify(profitableResult, null, 2));

  // Prepare trade options with more context
  const tradeChoices = profitableResult.map((trade, index) => {
    const amountIn = parseFloat(trade.quoteResult1.amountInRaw);
    const amountOut = parseFloat(trade.quoteResult2.amountInRaw);
    return {
      name: `Trade ${index + 1}: Buy ${amountIn} ${trade.quoteResult1.tokenOut.symbol} on ${trade.quoteResult1.dex}, then sell for ${amountOut} ${trade.quoteResult2.tokenOut.symbol} on ${trade.quoteResult2.dex}. Profit: ${trade.profit.toFixed(2)}%`,
      value: index
    };
  });

  // Ask user to select a trade
  const response: {
    selectedTradeIndex: number;
  } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTradeIndex',
      message: `Select the trade you want to proceed with (${profitableResult.length} profitable trades found):`,
      choices: tradeChoices
    }
  ]);

  // Get the selected trade
  const selectedTrade: TradingPayload = profitableResult[response.selectedTradeIndex];
  console.log(`You selected Trade ${response.selectedTradeIndex + 1}:`);
  console.log(`Trading ${selectedTrade.quoteResult1.tokenIn.symbol} to ${selectedTrade.quoteResult1.tokenOut.symbol}`);

  // Ask for confirmation to proceed
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Do you want to proceed with this trade? (Profit: ${selectedTrade.profit.toFixed(2)}%)`,
      default: false
    }
  ]);

  // Start trading if confirmed
  if (confirm) {
    const tradePayload: TradingPayload = {
      quoteResult1: selectedTrade.quoteResult1,
      quoteResult2: selectedTrade.quoteResult2,
      profit: selectedTrade.profit
    };
    startTrading(tradePayload);
  } else {
    // exit message
    console.log('Trade cancelled');
    process.exit(0);
  }
}

function checkProfitability(results: QuoteResult[]): TradingPayload[] {
  // Group quotes by unordered pair of token addresses
  const groupedResults = results.reduce<Record<string, { tokenA: Token; tokenB: Token; quotes: QuoteResult[] }>>(
    (acc, result) => {
      const addresses = [result.tokenIn.address, result.tokenOut.address].sort();
      const key = `${addresses[0]}-${addresses[1]}`;
      if (!acc[key]) {
        const tokens =
          addresses[0] === result.tokenIn.address
            ? { tokenA: result.tokenIn, tokenB: result.tokenOut }
            : { tokenA: result.tokenOut, tokenB: result.tokenIn };
        acc[key] = { ...tokens, quotes: [] };
      }
      acc[key].quotes.push(result);
      return acc;
    },
    {}
  );

  return Object.values(groupedResults).flatMap(({ tokenA, tokenB, quotes }) => {
    const validQuotes = quotes
      .filter((q) => q.quoteResult !== null)
      .map((q) => {
        const amountIn = parseFloat(q.amountIn);
        const quoteResult = parseFloat(q.quoteResult!);
        let priceAB: number;
        if (q.tokenIn.address === tokenA.address) {
          // Selling tokenA for tokenB
          priceAB = quoteResult / amountIn; // Corrected calculation
        } else {
          // Buying tokenA with tokenB
          priceAB = amountIn / quoteResult; // Corrected calculation
        }
        return {
          ...q,
          amountIn,
          quoteResult,
          priceAB
        };
      })
      .sort((a, b) => a.priceAB - b.priceAB);

    // Separate buy and sell quotes
    const buyQuotes = validQuotes.filter(
      (q) => q.tokenIn.address === tokenB.address && q.tokenOut.address === tokenA.address
    );
    const sellQuotes = validQuotes.filter(
      (q) => q.tokenIn.address === tokenA.address && q.tokenOut.address === tokenB.address
    );

    if (buyQuotes.length === 0 || sellQuotes.length === 0) return [];

    const bestBuyQuote = buyQuotes[0]; // Lowest priceAB
    const bestSellQuote = sellQuotes[sellQuotes.length - 1]; // Highest priceAB

    // Compute profit margin
    const profitMargin = ((bestSellQuote.priceAB - bestBuyQuote.priceAB) / bestBuyQuote.priceAB) * 100;

    if (profitMargin < 1) return []; // Adjust the threshold as needed

    const toQuotePayload = (quote: typeof bestBuyQuote): QuotePayload => ({
      tokenIn: quote.tokenIn,
      tokenOut: quote.tokenOut,
      dex: quote.dex,
      networkUrl: quote.network.rpcUrl,
      amountInRaw: quote.amountIn.toString(),
      fee: 0
    });

    return [
      {
        quoteResult1: toQuotePayload(bestBuyQuote),
        quoteResult2: toQuotePayload(bestSellQuote),
        profit: profitMargin
      }
    ];
  });
}


// Fetch quotes for all pools from the loaded file
async function getQuotes(): Promise<QuoteResult[]> {
  const pools = loadPools();
  const results: QuoteResult[] = [];
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  console.log(`Fetching quotes for ${pools.length} pools...`);
  progressBar.start(pools.length, 0);

  for (const pool of pools) {
    const payload: QuotePayload = {
      tokenIn: pool.tokenIn,
      tokenOut: pool.tokenOut,
      networkUrl: pool.network.rpcUrl,
      amountInRaw: pool.amountIn,
      fee: pool.fee,
      dex: pool.dex,
    };

    try {
      const quote = await getQuote(payload);
      results.push({
        amountIn: pool.amountIn,
        tokenIn: pool.tokenIn,
        tokenOut: pool.tokenOut,
        network: pool.network,
        dex: pool.dex,
        quoteResult: quote,
      });
    } catch (error) {
      console.error(`Error fetching quote for ${pool.dex}`, error);
    }

    progressBar.increment();
  }

  progressBar.stop();
  return results;
}


// Function to display results in a table
function displayResults(results: QuoteResult[]) {
  // Group results by network
  const groupedResults: {
    [networkName: string]: QuoteResult[];
  } = results.reduce(
    (acc: { [networkName: string]: QuoteResult[] }, result: QuoteResult) => {
      const key = result.network.networkName;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    },
    {} as { [networkName: string]: QuoteResult[] }
  );

  // Get all unique DEXs
  const allDexes: DEX[] = Array.from(new Set(results.map((result) => result.dex)));

  // For each network, create a table
  for (const [networkName, networkResults] of Object.entries(groupedResults)) {
    console.log(`\nNetwork: ${networkName}`);

    // Create table columns dynamically based on the DEXs present
    const columns = [
      { name: 'tokenPair', title: 'Token Pair', alignment: 'left' },
      ...allDexes.map((dex) => ({ name: dex, title: `${dex} Quote`, alignment: 'right' })),
      { name: 'bestQuote', title: 'Best Quote', alignment: 'center', color: 'green' },
      { name: 'percentageDifference', title: '% Difference', alignment: 'left' }
    ];

    const p: Table = new Table({ columns });

    // Group results by token pair within the network
    const tokenPairResults = networkResults.reduce(
      (acc: { [tokenPair: string]: QuoteResult[] }, result: QuoteResult) => {
        const key = `${result.tokenIn.symbol}/${result.tokenOut.symbol}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(result);
        return acc;
      },
      {} as { [tokenPair: string]: QuoteResult[] }
    );

    // Process each token pair
    for (const [tokenPair, pairResults] of Object.entries(tokenPairResults)) {
      // Map DEX names to quotes
      const dexQuotes = pairResults.reduce(
        (acc, result) => {
          const amount = parseFloat(result.quoteResult || 'NaN');
          if (!isNaN(amount)) {
            acc[result.dex] = amount;
          }
          return acc;
        },
        {} as { [dex in DEX]: number }
      );

      // If no valid quotes, add a row indicating that
      if (Object.keys(dexQuotes).length === 0) {
        const rowData: any = {
          tokenPair: tokenPair,
          bestQuote: 'No valid quotes available',
          percentageDifference: ''
        };
        allDexes.forEach((dex) => {
          rowData[dex] = '';
        });
        p.addRow(rowData);
        continue;
      }

      // Find the best quote
      const bestDex: string = Object.keys(dexQuotes).reduce((best, dex) => {
        return dexQuotes[dex as DEX] > dexQuotes[best as DEX] ? dex : best;
      }, Object.keys(dexQuotes)[0]);

      const bestQuoteAmount: number = dexQuotes[bestDex as DEX];

      // Calculate percentage differences
      const percentageDifferences = Object.entries(dexQuotes).map(([dex, amount]) => {
        const diff = ((bestQuoteAmount - amount) / bestQuoteAmount) * 100;
        return { dex, difference: diff.toFixed(2) };
      });

      // Prepare data for the table
      const rowData: any = {
        tokenPair: tokenPair,
        bestQuote: bestDex,
        percentageDifference: percentageDifferences.map((diff) => `${diff.dex}: ${diff.difference}%`).join(', ')
      };

      allDexes.forEach((dex) => {
        rowData[dex] = dexQuotes[dex as DEX]?.toString() || 'N/A';
      });

      p.addRow(rowData);
    }

    // Print the table for the current network
    p.printTable();
  }
}

runQuotes();
