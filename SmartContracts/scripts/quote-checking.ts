import { Token } from '@uniswap/sdk-core';
import cliProgress from 'cli-progress';
import { Table } from 'console-table-printer';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { TOKENS } from './constants';
import { DEX, IDexPool, QuotePayload, QuoteResult, TradingPayload } from './interfaces';
import { getQuote } from './quote-request';
import { startTrading } from './trading-process';

// Function to prompt the user to select a token to grow
async function selectTokenToGrow(): Promise<Token | null> {
  const tokenChoices = [
    {
      name: 'All tokens',
      value: null
    },
    ...TOKENS.map((token: Token) => ({
      name: `${token.symbol} (${token.name}) on chain ${token.chainId}`,
      value: token
    }))
  ];

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
  const filePath: string = path.resolve(__dirname, './generated-data/pool-listing.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const pools: IDexPool[] = JSON.parse(rawData) as IDexPool[];

  // Group pools by token pairs
  const groupedPools: Record<string, IDexPool[]> = pools.reduce<Record<string, IDexPool[]>>((acc, pool) => {
    const addresses: string[] = [pool.tokenIn.address, pool.tokenOut.address].sort();
    const key: string = `${addresses[0]}-${addresses[1]}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(pool);
    return acc;
  }, {});

  // Filter out pairs that have only one pool
  const filteredPools: IDexPool[] = Object.values(groupedPools)
    .filter((poolGroup: IDexPool[]) => poolGroup.length > 1)
    .flat();

  return filteredPools;
}

// Load pools and add reverse directions
function loadFilteredPools(): IDexPool[] {
  const pools: IDexPool[] = loadPools();

  // Group pools by token pairs
  const groupedPools: Record<string, IDexPool[]> = pools.reduce<Record<string, IDexPool[]>>((acc, pool) => {
    const addresses = [pool.tokenIn.address, pool.tokenOut.address].sort();
    const key = `${addresses[0]}-${addresses[1]}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(pool);
    return acc;
  }, {});

  // Duplicate pools to include both directions
  const bidirectionalPools: IDexPool[] = Object.values(groupedPools).flatMap((poolGroup) => {
    return poolGroup.flatMap((pool) => {
      // Original direction
      const originalPool = { ...pool };
      // Reverse direction
      const reversePool: IDexPool = {
        ...pool,
        tokenIn: pool.tokenOut,
        tokenOut: pool.tokenIn,
        amountIn: pool.amountIn,
        dex: pool.dex,
        fee: pool.fee,
        network: pool.network
      };
      return [originalPool, reversePool];
    });
  });

  console.log(`Total pools after adding reverse directions: ${bidirectionalPools.length}`);
  return bidirectionalPools;
}

// Modify getQuotes to accept an optional Token parameter
async function getQuotes(selectedToken?: Token | null): Promise<QuoteResult[]> {
  const pools: IDexPool[] = loadFilteredPools();

  // Filter pools based on the selected token if provided
  const filteredPools: IDexPool[] = selectedToken
    ? pools.filter(
        (pool: IDexPool) => pool.tokenIn.address === selectedToken.address || pool.tokenOut.address === selectedToken.address
      )
    : pools;

  const results: QuoteResult[] = [];
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  console.log(`Fetching quotes for ${filteredPools.length} pools...`);
  progressBar.start(filteredPools.length, 0);

  for (const pool of filteredPools) {
    // Filter pools based on the selected token if provided
    if (
      selectedToken &&
      pool.tokenIn.address !== selectedToken.address &&
      pool.tokenOut.address !== selectedToken.address
    ) {
      continue;
    }

    const payload: QuotePayload = {
      tokenIn: pool.tokenIn,
      tokenOut: pool.tokenOut,
      networkUrl: pool.network.rpcUrl,
      amountInRaw: pool.amountIn,
      fee: pool.fee,
      dex: pool.dex
    };

    try {
      const quote: string | null = await getQuote(payload);

      results.push({
        amountIn: pool.amountIn,
        tokenIn: pool.tokenIn,
        tokenOut: pool.tokenOut,
        network: pool.network,
        dex: pool.dex,
        quoteResult: quote
      });
    } catch (error) {
      console.error(`Error fetching quote for ${pool.dex}`, error);
    }

    progressBar.increment();
  }

  progressBar.stop();
  return results;
}

// Update runQuotes to prompt the user for a token selection and pass it to getQuotes
async function runQuotes(): Promise<void> {
  // Prompt the user to select the token to grow
  const selectedToken = await selectTokenToGrow();

  // get quotes and display
  const results: QuoteResult[] = await getQuotes(selectedToken);
  displayResults(results);

  // check profitability
  const profitableResult: TradingPayload[] = checkProfitability(results);
  if (profitableResult.length === 0) {
    console.log('No profitable trades found.');
    return;
  }

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

// Function to check profitability of trades
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

  // Generate trading opportunities
  return Object.values(groupedResults).flatMap(({ tokenA, tokenB, quotes }) => {
    const validQuotes = quotes
      .filter((q) => q.quoteResult !== null)
      .map((q) => {
        const amountIn = parseFloat(q.amountIn);
        const quoteResult = parseFloat(q.quoteResult!);
        let priceAB: number;

        if (q.tokenIn.address === tokenA.address) {
          // Selling tokenA for tokenB
          priceAB = quoteResult / amountIn; // Price of tokenA in terms of tokenB
        } else {
          // Buying tokenA with tokenB
          priceAB = amountIn / quoteResult; // Price of tokenA in terms of tokenB
        }

        return { ...q, amountIn, quoteResult, priceAB };
      });

    const opportunities: TradingPayload[] = [];

    for (let i = 0; i < validQuotes.length; i++) {
      for (let j = 0; j < validQuotes.length; j++) {
        if (i === j) continue;

        const buyQuote = validQuotes[i];
        const sellQuote = validQuotes[j];

        // Ensure we're buying and selling on different DEXes
        if (buyQuote.dex === sellQuote.dex) continue;

        // We need to buy tokenA with tokenB and sell tokenA for tokenB
        if (
          buyQuote.tokenIn.address === tokenB.address &&
          buyQuote.tokenOut.address === tokenA.address &&
          sellQuote.tokenIn.address === tokenA.address &&
          sellQuote.tokenOut.address === tokenB.address
        ) {
          // Calculate profit margin
          const profitMargin = ((sellQuote.priceAB - buyQuote.priceAB) / buyQuote.priceAB) * 100;

          // Set a minimum profit margin threshold
          const MIN_PROFIT_MARGIN = 1; // Adjust as needed
          if (profitMargin < MIN_PROFIT_MARGIN) continue;

          // Prepare QuotePayload
          const toQuotePayload = (quote: typeof buyQuote): QuotePayload => ({
            tokenIn: quote.tokenIn,
            tokenOut: quote.tokenOut,
            dex: quote.dex,
            networkUrl: quote.network.rpcUrl,
            amountInRaw: quote.amountIn.toString(),
            fee: 0
          });

          opportunities.push({
            quoteResult1: toQuotePayload(buyQuote),
            quoteResult2: toQuotePayload(sellQuote),
            profit: profitMargin
          });
        }
      }
    }

    return opportunities;
  });
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
