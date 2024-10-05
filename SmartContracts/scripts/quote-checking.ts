import { getUniswapQuote } from './quote-uniswap';
import { TOKEN_PAIRS } from './constants';

// Function to run quotes for all token pairs
async function runQuotes() {
  for (const pair of TOKEN_PAIRS) {
    console.log(
      `\nFetching quote for swapping ${pair.amountIn} ${pair.tokenIn.symbol} to ${pair.tokenOut.symbol} on ${pair.network.name}...`
    );
    await getUniswapQuote(pair.tokenIn, pair.tokenOut, pair.network.rpcUrl, pair.amountIn, pair.fee);
  }
}

runQuotes();
