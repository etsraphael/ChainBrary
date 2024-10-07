import cliProgress from 'cli-progress';
import { Table } from 'console-table-printer';
import { TOKEN_PAIRS } from './constants';
import { DEX, QuoteResult } from './interfaces';
import { getPancakeSwapQuote } from './quote-pancakeswap';
import { getSushiSwapQuote } from './quote-sushiswap';
import { getUniswapQuote } from './quote-uniswap';

// Function to run quotes for all token pairs
async function runQuotes(): Promise<void> {
  const results: QuoteResult[] = [];

  // Initialize the progress bar
  const totalTasks: number = TOKEN_PAIRS.length * 3; // Total number of quotes to fetch
  const progressBar: cliProgress.SingleBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(totalTasks, 0);

  for (const pair of TOKEN_PAIRS) {
    const dexes = [DEX.UNISWAP, DEX.SUSHISWAP, DEX.PANCAKESWAP];

    for (const dex of dexes) {
      let quote: string | null;

      switch (dex) {
        case DEX.UNISWAP:
          quote = await getUniswapQuote(pair.tokenIn, pair.tokenOut, pair.network.rpcUrl, pair.amountIn, pair.fee);
          break;
        case DEX.SUSHISWAP:
          quote = await getSushiSwapQuote(pair.tokenIn, pair.tokenOut, pair.network.rpcUrl, pair.amountIn);
          break;
        case DEX.PANCAKESWAP:
          quote = await getPancakeSwapQuote(pair.tokenIn, pair.tokenOut, pair.network.rpcUrl, pair.amountIn);
          break;
      }

      progressBar.increment();

      results.push({
        tokenIn: pair.tokenIn,
        tokenOut: pair.tokenOut,
        network: pair.network,
        dex: dex,
        quoteResult: quote
      });
    }
  }
  progressBar.stop();
  displayResults(results);
}

// Function to display results in a table
function displayResults(results: QuoteResult[]) {
  console.log('\nQuotes Comparison Table:\n');

  // Group results by token pair and network
  const groupedResults = results.reduce(
    (
      acc: {
        [key: string]: QuoteResult[];
      },
      result: QuoteResult
    ) => {
      const key = `${result.tokenIn.symbol}/${result.tokenOut.symbol} (${result.network.name})`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    },
    {} as { [key: string]: QuoteResult[] }
  );

  // Get all unique DEXs
  const allDexes = Array.from(new Set(results.map((result) => result.dex)));

  // Create table columns dynamically based on the DEXs present
  const columns = [
    { name: 'tokenPair', title: 'Token Pair (Network)', alignment: 'left' },
    ...allDexes.map((dex) => ({ name: dex, title: `${dex} Quote`, alignment: 'right' })),
    { name: 'bestQuote', title: 'Best Quote', alignment: 'center', color: 'green' },
    { name: 'percentageDifference', title: '% Difference', alignment: 'left' }
  ];

  const p = new Table({ columns });

  // Process each group
  for (const [tokenPair, group] of Object.entries(groupedResults)) {
    // Map DEX names to quotes
    const dexQuotes = group.reduce(
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

  p.printTable();
}

runQuotes();
