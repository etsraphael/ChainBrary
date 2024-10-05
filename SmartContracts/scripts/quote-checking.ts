import { TOKEN_PAIRS } from './constants';
import { getPancakeSwapQuote } from './quote-pancakeswap';
import { getSushiSwapQuote } from './quote-sushiswap';
import { getUniswapQuote } from './quote-uniswap';

// Function to run quotes for all token pairs
async function runQuotes() {
  const results = [];

  for (const pair of TOKEN_PAIRS) {
    console.log(
      `\nFetching quotes for swapping ${pair.amountIn} ${pair.tokenIn.symbol} to ${pair.tokenOut.symbol} on ${pair.network.name}...`
    );

    const uniswapQuote: string | null = await getUniswapQuote(
      pair.tokenIn,
      pair.tokenOut,
      pair.network.rpcUrl,
      pair.amountIn,
      pair.fee
    );

    const sushiswapQuote: string | null = await getSushiSwapQuote(
      pair.tokenIn,
      pair.tokenOut,
      pair.network.rpcUrl,
      pair.amountIn
    );

    const pancakeswapQuote: string | null = await getPancakeSwapQuote(
      pair.tokenIn,
      pair.tokenOut,
      pair.network.rpcUrl,
      pair.amountIn
    );

    results.push({
      tokenIn: pair.tokenIn.symbol,
      tokenOut: pair.tokenOut.symbol,
      network: pair.network.name,
      uniswapQuote,
      sushiswapQuote,
      pancakeswapQuote
    });

    console.log('Quote fetching complete.');
  }

  displayResults(results);
}

runQuotes();

// Function to display results in a table
function displayResults(results: any[]) {
  console.log('\nQuotes Comparison Table:\n');

  // Table header
  console.log(
    `| Token Pair (Network) | Uniswap Quote | SushiSwap Quote | PancakeSwap Quote | Best Quote | % Difference |`
  );
  console.log(
    `|----------------------|---------------|-----------------|-------------------|------------|--------------|`
  );

  results.forEach((result) => {
    const { tokenIn, tokenOut, network, uniswapQuote, sushiswapQuote, pancakeswapQuote } = result;

    // Convert quotes to numbers for comparison
    const quotes = [
      { dex: 'Uniswap', amount: parseFloat(uniswapQuote) },
      { dex: 'SushiSwap', amount: parseFloat(sushiswapQuote) },
      { dex: 'PancakeSwap', amount: parseFloat(pancakeswapQuote) }
    ].filter((quote) => !isNaN(quote.amount));

    if (quotes.length === 0) {
      console.log(`| ${tokenIn}/${tokenOut} (${network}) | No valid quotes available |`);
      return;
    }

    // Find the best quote
    const bestQuote = quotes.reduce((prev, current) => (prev.amount > current.amount ? prev : current));

    // Calculate percentage differences
    const percentageDifferences = quotes.map((quote) => {
      const diff = ((bestQuote.amount - quote.amount) / bestQuote.amount) * 100;
      return { dex: quote.dex, difference: diff.toFixed(2) };
    });

    // Prepare row data
    const uniswapDisplay = uniswapQuote ? `${uniswapQuote}` : 'N/A';
    const sushiswapDisplay = sushiswapQuote ? `${sushiswapQuote}` : 'N/A';
    const pancakeswapDisplay = pancakeswapQuote ? `${pancakeswapQuote}` : 'N/A';
    const bestQuoteDex = bestQuote.dex;
    const percentageDifferenceDisplay = percentageDifferences
      .map((diff) => `${diff.dex}: ${diff.difference}%`)
      .join(', ');

    // Display the row
    console.log(
      `| ${tokenIn}/${tokenOut} (${network}) | ${uniswapDisplay} | ${sushiswapDisplay} | ${pancakeswapDisplay} | ${bestQuoteDex} | ${percentageDifferenceDisplay} |`
    );
  });
}
