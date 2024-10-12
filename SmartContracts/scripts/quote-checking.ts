import cliProgress from 'cli-progress';
import { Table } from 'console-table-printer';
import { TOKEN_PAIRS } from './constants';
import { DEX, IDexPool, NetworkNameList, QuotePayload, QuoteResult, TradingPayload } from './interfaces';
import inquirer from 'inquirer';
import { getQuote } from './quote-request';
import { Token } from '@uniswap/sdk-core';
import { startTrading } from './trading-process';

// Function to run quotes for all token pairs
async function runQuotes(): Promise<void> {
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

  // Ask user to select a trade
  const response: {
    selectedTradeIndex: number;
  } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTradeIndex',
      message: 'Select the trade you want to proceed with:',
      choices: profitableResult.map((trade, index) => ({
        name: `Trade ${index + 1}: ${trade.quoteResult1.tokenIn.symbol} to ${trade.quoteResult1.tokenOut.symbol} with ${trade.profit.toFixed(2)}% profit. From ${trade.quoteResult1.dex} to ${trade.quoteResult2.dex}. Throught ${trade.quoteResult1.networkUrl}`,
        value: index
      }))
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
  const groupedResults = results.reduce<Record<string, { tokenA: Token, tokenB: Token, quotes: QuoteResult[] }>>((acc, result) => {
    const addresses = [result.tokenIn.address, result.tokenOut.address].sort();
    const key = `${addresses[0]}-${addresses[1]}`;
    if (!acc[key]) {
      const tokens = addresses[0] === result.tokenIn.address
        ? { tokenA: result.tokenIn, tokenB: result.tokenOut }
        : { tokenA: result.tokenOut, tokenB: result.tokenIn };
      acc[key] = { ...tokens, quotes: [] };
    }
    acc[key].quotes.push(result);
    return acc;
  }, {});

  return Object.values(groupedResults).flatMap(({ tokenA, tokenB, quotes }) => {
    const validQuotes = quotes
      .filter((q) => q.quoteResult !== null)
      .map((q) => {
        const amountIn = parseFloat(q.amountIn);
        const quoteResult = parseFloat(q.quoteResult!);
        console.log('quoteResult', quoteResult);
        console.log('amountIn', amountIn);
        let priceAB: number;
        if (q.tokenIn.address === tokenA.address) {
          // Selling tokenA for tokenB
          priceAB = amountIn / quoteResult;
        } else {
          // Buying tokenA with tokenB
          priceAB = quoteResult / amountIn;
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
    const buyQuotes = validQuotes.filter(q => q.tokenIn.address === tokenB.address && q.tokenOut.address === tokenA.address);
    const sellQuotes = validQuotes.filter(q => q.tokenIn.address === tokenA.address && q.tokenOut.address === tokenB.address);

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
// Function retrieve quotes for a token pair
async function getQuotes(): Promise<QuoteResult[]> {
  const startTime = Date.now(); // Start the timer
  const results: QuoteResult[] = [];

  // Initialize the progress bar
  const totalTasks: number = TOKEN_PAIRS.reduce((acc, pair) => acc + pair.dexSupported.length, 0); // Total number of quotes to fetch
  const progressBar: cliProgress.SingleBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(totalTasks, 0);

  for (const pair of TOKEN_PAIRS) {
    // Filter the DEXes to only include those supported by the pair
    const supportedDexes: DEX[] = pair.dexSupported;

    for (const dex of supportedDexes) {
      let payload: QuotePayload = {
        tokenIn: pair.tokenIn,
        tokenOut: pair.tokenOut,
        networkUrl: pair.network.rpcUrl,
        amountInRaw: pair.amountIn,
        fee: pair.fee,
        dex: dex // this will only include the dex supported by the pair
      };

      let quote: string | null = await getQuote(payload);

      progressBar.increment();

      results.push({
        amountIn: pair.amountIn,
        tokenIn: pair.tokenIn,
        tokenOut: pair.tokenOut,
        network: pair.network,
        dex: dex,
        quoteResult: quote
      });
    }
  }

  progressBar.stop();

  const endTime = Date.now(); // End the timer
  const elapsedSeconds: string = ((endTime - startTime) / 1000).toFixed(2); // Calculate elapsed time in seconds
  console.log('\n');
  console.log(`\nTotal time taken: ${elapsedSeconds} seconds`);
  return results;
}

// Function to display results in a table
function displayResults(results: QuoteResult[]) {
  // Group results by network
  const groupedResults: {
    [networkName: string]: QuoteResult[];
  } = results.reduce(
    (acc: { [networkName: string]: QuoteResult[] }, result: QuoteResult) => {
      const key = result.network.name;
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
