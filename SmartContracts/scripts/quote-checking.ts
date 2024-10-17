import { Token } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';
import cliProgress from 'cli-progress';
import { Table } from 'console-table-printer';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { NETWORKS, routerContracts, TOKENS } from './constants';
import { DEX, IDexPool, QuotePayload, QuoteResult, TradingPayload } from './interfaces';
import { getQuote } from './quote-request';
import { startTrading } from './trading-process';

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

// Function to prompt the user to select a token to grow and amount
async function selectTokenToGrow(): Promise<{ token: Token | null; amount: string }> {
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

  let amount = '1'; // default amount

  if (response.token) {
    const amountResponse = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: `Enter the amount of ${response.token.symbol} to start with:`,
        validate: (input: string) => {
          return !isNaN(parseFloat(input)) && parseFloat(input) > 0
            ? true
            : 'Please enter a valid number greater than 0';
        },
        default: '1'
      }
    ]);
    amount = amountResponse.amount;
  }

  return { token: response.token, amount };
}

// Update generatePoolsForToken to include SUSHISWAP_V3
function generatePoolsForToken(selectedToken: Token, amountIn: string): IDexPool[] {
  const pools: IDexPool[] = [];
  for (const network of NETWORKS) {
    if (network.chainId !== selectedToken.chainId) continue; // Ensure tokens are on the same chain
    const tokensInNetwork = TOKENS.filter((t) => t.chainId === network.chainId);
    const otherTokens = tokensInNetwork.filter((t) => t.address !== selectedToken.address);

    for (const token of otherTokens) {
      for (const dex of [DEX.UNISWAP_V3, DEX.PANCAKESWAP_V3, DEX.SUSHISWAP_V3]) {
        const router = routerContracts(dex);
        if (router && router[network.chainId]) {
          // Define fee levels per DEX
          const feeLevels: number[] = (() => {
            switch (dex) {
              case DEX.UNISWAP_V3:
                return [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM];
              case DEX.PANCAKESWAP_V3:
                return [FeeAmount.LOWEST, 2500, FeeAmount.HIGH];
              case DEX.SUSHISWAP_V3:
                return [FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];
              default:
                return [];
            }
          })();

          for (const fee of feeLevels) {
            // Create buy pool (selectedToken -> other token)
            pools.push({
              network,
              tokenIn: selectedToken,
              tokenOut: token,
              amountIn: amountIn,
              fee,
              dex,
              type: 'BUY'
            });
          }
        }
      }
    }
  }
  return pools;
}

// Modify getQuotes to fetch sell quotes after obtaining buy quotes
async function getQuotes(selectedToken?: Token | null, amountIn?: string): Promise<QuoteResult[]> {
  const pools: IDexPool[] = selectedToken ? generatePoolsForToken(selectedToken, amountIn || '1') : loadFilteredPools();

  const results: QuoteResult[] = [];
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  console.log(`Fetching quotes for ${pools.length} pools...`);
  progressBar.start(pools.length, 0);

  const dexes = [DEX.UNISWAP_V3, DEX.PANCAKESWAP_V3, DEX.SUSHISWAP_V3];

  for (const pool of pools) {
    const payload: QuotePayload = {
      tokenIn: pool.tokenIn,
      tokenOut: pool.tokenOut,
      networkUrl: pool.network.rpcUrl,
      amountInRaw: pool.amountIn,
      fee: pool.fee,
      dex: pool.dex
    };

    try {
      const buyQuote: QuoteResult | null = await getQuote(payload);
      if (buyQuote) {
        const buyQuoteWithType: QuoteResult = { ...buyQuote, type: 'BUY' };
        results.push(buyQuoteWithType);

        // Rotate to the next DEX for sell
        const dexIndex = dexes.indexOf(pool.dex);
        const sellDex = dexes[(dexIndex + 1) % dexes.length];

        const sellPayload: QuotePayload = {
          tokenIn: pool.tokenOut, // token we obtained from buy
          tokenOut: pool.tokenIn, // original token
          networkUrl: pool.network.rpcUrl,
          amountInRaw: buyQuote.amountOut,
          fee: pool.fee,
          dex: sellDex // Use a different DEX for sell
        };
        const sellQuote: QuoteResult | null = await getQuote(sellPayload);
        if (sellQuote) {
          const sellQuoteWithType: QuoteResult = {
            ...sellQuote,
            type: 'SELL',
            relatedBuyQuote: buyQuoteWithType
          };
          results.push(sellQuoteWithType);
        }
      }
    } catch (error) {
      console.error(`Error fetching quote for ${pool.dex}`, error);
    }

    progressBar.increment();
  }

  progressBar.stop();
  return results;
}

// Function to check profitability of trades
function checkProfitability(results: QuoteResult[], selectedToken?: Token | null): TradingPayload[] {
  const opportunities: TradingPayload[] = [];

  // Filter buy and sell quotes
  const buyQuotes = results.filter((q) => q.type === 'BUY') as QuoteResult[];
  const sellQuotes = results.filter((q) => q.type === 'SELL') as QuoteResult[];

  for (const buyQuote of buyQuotes) {
    const relatedSellQuote = sellQuotes.find(
      (sellQuote: QuoteResult) =>
        sellQuote.relatedBuyQuote &&
        sellQuote.relatedBuyQuote.tokenIn.address === buyQuote.tokenIn.address &&
        sellQuote.relatedBuyQuote.tokenOut.address === buyQuote.tokenOut.address &&
        sellQuote.dex !== buyQuote.dex && // Ensure different DEXes
        sellQuote.tokenIn.address === buyQuote.tokenOut.address &&
        sellQuote.tokenOut.address === buyQuote.tokenIn.address &&
        sellQuote.relatedBuyQuote.amountOut === buyQuote.amountOut // Ensure matching amounts
    );

    if (relatedSellQuote) {
      const startingAmount = parseFloat(buyQuote.amountIn);
      const endingAmount = parseFloat(relatedSellQuote.amountOut);

      const profitAmount = endingAmount - startingAmount;
      const profitPercentage = (profitAmount / startingAmount) * 100;

      const MIN_PROFIT_MARGIN = 0.5; // Adjust as needed
      if (profitPercentage >= MIN_PROFIT_MARGIN) {
        opportunities.push({
          quoteResult1: buyQuote,
          quoteResult2: relatedSellQuote,
          profit: profitPercentage,
          profitAmount: profitAmount
        });
      }
    }
  }

  return opportunities;
}

// Update runQuotes to use the updated functions
async function runQuotes(): Promise<void> {
  // Prompt the user to select the token to grow and amount
  const { token: selectedToken, amount: amountIn } = await selectTokenToGrow();

  // get quotes and display
  const results: QuoteResult[] = await getQuotes(selectedToken, amountIn);
  displayResults(results);

  // check profitability
  const profitableResult: TradingPayload[] = checkProfitability(results, selectedToken);
  if (profitableResult.length === 0) {
    console.log('No profitable trades found.');
    return;
  }

  // Prepare trade options with more context
  const tradeChoices = profitableResult.map((trade, index) => {
    const amountIn: number = parseFloat(trade.quoteResult1.amountIn);
    const amountOut: number = parseFloat(trade.quoteResult2.amountOut);
    const profitAmount: number = trade.profitAmount!;
    return {
      name: `Trade ${index + 1}: Start with ${amountIn} ${trade.quoteResult1.tokenIn.symbol} to buy ${trade.quoteResult1.tokenOut.symbol} on ${trade.quoteResult1.dex}, then sell for ${amountOut.toFixed(6)} ${trade.quoteResult2.tokenOut.symbol} on ${trade.quoteResult2.dex}. Path: ${trade.quoteResult1.tokenIn.symbol} -> ${trade.quoteResult1.tokenOut.symbol} -> ${trade.quoteResult2.tokenOut.symbol}. Profit: ${trade.profit.toFixed(2)}% (${profitAmount.toFixed(6)} ${trade.quoteResult2.tokenOut.symbol})`,
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
      profit: selectedTrade.profit,
      profitAmount: selectedTrade.profitAmount
    };
    startTrading(tradePayload);
  } else {
    // exit message
    console.log('Trade cancelled');
    process.exit(0);
  }
}

// Modify displayResults to only show one direction per token pair
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

    // Group results by ordered token pair within the network
    const tokenPairResults = networkResults.reduce(
      (acc: { [tokenPair: string]: QuoteResult[] }, result: QuoteResult) => {
        if (result.type !== 'BUY') return acc; // Only consider 'BUY' quotes for display
        const addresses = [result.tokenIn.address, result.tokenOut.address];
        const symbols = [result.tokenIn.symbol, result.tokenOut.symbol];
        const sorted = addresses[0] < addresses[1];
        const key = sorted ? `${symbols[0]}/${symbols[1]}` : `${symbols[1]}/${symbols[0]}`;
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
          const amount = parseFloat(result.amountOut || 'NaN');
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
      const bestDex: DEX = Object.keys(dexQuotes).reduce((best, dex) => {
        return dexQuotes[dex as DEX] > dexQuotes[best as DEX] ? dex : best;
      }, Object.keys(dexQuotes)[0]) as DEX;

      const bestQuoteAmount: number = dexQuotes[bestDex];

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
        rowData[dex] = dexQuotes[dex as DEX]?.toFixed(6) || 'N/A';
      });

      p.addRow(rowData);
    }

    // Print the table for the current network
    p.printTable();
  }
}

runQuotes();
