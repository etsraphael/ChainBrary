import cliProgress from 'cli-progress';
import { Table } from 'console-table-printer';
import { TOKEN_PAIRS } from './constants';
import { DEX, QuotePayload, QuoteResult } from './interfaces';
import inquirer from 'inquirer';
import { getQuote } from './quote-request';

// Function to run quotes for all token pairs
async function runQuotes(): Promise<void> {
  const results: QuoteResult[] = await getQuotes();
  displayResults(results);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to proceed with this trade?',
      default: false
    }
  ]);

  if (confirm) {
    console.log('Starting the trade...');
  } else {
    // exit message 
    console.log('Trade cancelled');
    process.exit(0);
  }
}

// Function retrieve quotes for a token pair
async function getQuotes(): Promise<QuoteResult[]> {
  const startTime = Date.now(); // Start the timer
  const results: QuoteResult[] = [];
  const dexes: DEX[] = [DEX.UNISWAP_V3, DEX.SUSHISWAP_V2, DEX.PANCAKESWAP_V2, DEX.PANCAKESWAP_V3];

  // Initialize the progress bar
  const totalTasks: number = TOKEN_PAIRS.length * dexes.length; // Total number of quotes to fetch
  const progressBar: cliProgress.SingleBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(totalTasks, 0);

  for (const pair of TOKEN_PAIRS) {
    for (const dex of dexes) {
      let payload: QuotePayload = {
        tokenIn: pair.tokenIn,
        tokenOut: pair.tokenOut,
        networkUrl: pair.network.rpcUrl,
        amountInRaw: pair.amountIn,
        fee: pair.fee,
        dex: dex
      };

      let quote: string | null = await getQuote(payload);

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
