import { Table } from 'console-table-printer';
import { TOKEN_PAIRS } from './constants';
import { getPancakeSwapQuote } from './quote-pancakeswap';
import { getSushiSwapQuote } from './quote-sushiswap';
import { getUniswapQuote } from './quote-uniswap';
import cliProgress from 'cli-progress';

// Function to run quotes for all token pairs
async function runQuotes(): Promise<void> {
  const results = [];

  // Initialize the progress bar
  const totalTasks: number = TOKEN_PAIRS.length * 3; // Total number of quotes to fetch
  const progressBar: cliProgress.SingleBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(totalTasks, 0);

  for (const pair of TOKEN_PAIRS) {
    const uniswapQuote: string | null = await getUniswapQuote(
      pair.tokenIn,
      pair.tokenOut,
      pair.network.rpcUrl,
      pair.amountIn,
      pair.fee
    );
    progressBar.increment();

    const sushiswapQuote: string | null = await getSushiSwapQuote(
      pair.tokenIn,
      pair.tokenOut,
      pair.network.rpcUrl,
      pair.amountIn
    );
    progressBar.increment();

    const pancakeswapQuote: string | null = await getPancakeSwapQuote(
      pair.tokenIn,
      pair.tokenOut,
      pair.network.rpcUrl,
      pair.amountIn
    );
    progressBar.increment();

    results.push({
      tokenIn: pair.tokenIn.symbol,
      tokenOut: pair.tokenOut.symbol,
      network: pair.network.name,
      uniswapQuote,
      sushiswapQuote,
      pancakeswapQuote
    });
  }

  progressBar.stop();
  displayResults(results);
}

runQuotes();

// Function to display results in a table
function displayResults(results: any[]) {
  console.log('\nQuotes Comparison Table:\n');

  const p = new Table({
    columns: [
      { name: 'tokenPair', title: 'Token Pair (Network)', alignment: 'left' },
      { name: 'uniswapQuote', title: 'Uniswap Quote', alignment: 'right' },
      { name: 'sushiswapQuote', title: 'SushiSwap Quote', alignment: 'right' },
      { name: 'pancakeswapQuote', title: 'PancakeSwap Quote', alignment: 'right' },
      { name: 'bestQuote', title: 'Best Quote', alignment: 'center', color: 'green' },
      { name: 'percentageDifference', title: '% Difference', alignment: 'left' }
    ]
  });

  results.forEach((result) => {
    const { tokenIn, tokenOut, network, uniswapQuote, sushiswapQuote, pancakeswapQuote } = result;

    // Convert quotes to numbers for comparison
    const quotes = [
      { dex: 'Uniswap', amount: parseFloat(uniswapQuote) },
      { dex: 'SushiSwap', amount: parseFloat(sushiswapQuote) },
      { dex: 'PancakeSwap', amount: parseFloat(pancakeswapQuote) }
    ].filter((quote) => !isNaN(quote.amount));

    if (quotes.length === 0) {
      p.addRow({
        tokenPair: `${tokenIn}/${tokenOut} (${network})`,
        uniswapQuote: 'No valid quotes available',
        sushiswapQuote: '',
        pancakeswapQuote: '',
        bestQuote: '',
        percentageDifference: ''
      });
      return;
    }

    // Find the best quote
    const bestQuote = quotes.reduce((prev, current) => (prev.amount > current.amount ? prev : current));

    // Calculate percentage differences
    const percentageDifferences = quotes.map((quote) => {
      const diff = ((bestQuote.amount - quote.amount) / bestQuote.amount) * 100;
      return { dex: quote.dex, difference: diff.toFixed(2) };
    });

    // Prepare data
    const uniswapDisplay = uniswapQuote ? uniswapQuote : 'N/A';
    const sushiswapDisplay = sushiswapQuote ? sushiswapQuote : 'N/A';
    const pancakeswapDisplay = pancakeswapQuote ? pancakeswapQuote : 'N/A';
    const percentageDifferenceDisplay = percentageDifferences
      .map((diff) => `${diff.dex}: ${diff.difference}%`)
      .join(', ');

    p.addRow({
      tokenPair: `${tokenIn}/${tokenOut} (${network})`,
      uniswapQuote: uniswapDisplay,
      sushiswapQuote: sushiswapDisplay,
      pancakeswapQuote: pancakeswapDisplay,
      bestQuote: bestQuote.dex,
      percentageDifference: percentageDifferenceDisplay
    });
  });

  p.printTable();
}
