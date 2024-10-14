import fs from 'fs';
import path from 'path';
import { NETWORKS, TOKENS } from './constants';
import { DEX, IDexPool, INetwork, QuotePayload, UniswapFee } from './interfaces';
import { getQuote } from './quote-request';

// Generate all possible token pairs and pool configurations
function generateAllPools(): IDexPool[] {
  const pools: IDexPool[] = [];

  for (const tokenIn of TOKENS) {
    for (const tokenOut of TOKENS) {
      if (tokenIn.address === tokenOut.address || tokenIn.chainId !== tokenOut.chainId) {
        continue; // Skip identical tokens or tokens on different chains
      }

      // Filter numeric values from the UniswapFee enum
      const fees = Object.values(UniswapFee).filter((fee) => typeof fee === 'number') as number[];

      for (const fee of fees) {
        const network = getNetworkByChainId(tokenIn.chainId);

        for (const dex of [DEX.UNISWAP_V3, DEX.PANCAKESWAP_V3]) {
          pools.push({
            network,
            tokenIn,
            tokenOut,
            amountIn: '1',
            fee, // No need for `Number(fee)` as it's already numeric
            dex
          });
        }
      }
    }
  }

  console.log('pools', pools.length); // This should now correctly reflect the pool count
  return pools;
}

// Retrieve quotes for the generated pools
async function getQuotes(): Promise<IDexPool[]> {
  const pools = generateAllPools();
  const validPools: IDexPool[] = [];
  const checkedPairs: Set<string> = new Set(); // Track pairs with valid quotes (> 1)

  console.log(`Fetching quotes for ${pools.length} pools...`);

  for (const pool of pools) {
    // Create a unique identifier for the token pair and dex to track them
    const pairKey = `${pool.tokenIn.symbol}-${pool.tokenOut.symbol}-${pool.dex}`;

    // If we already found a quote > 1 for this pair, skip further calls
    if (checkedPairs.has(pairKey)) {
      console.log(`Skipping pool for ${pairKey} as a valid quote is already found.`);
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
      const quoteResult: string | null = await getQuote(payload);
      if (quoteResult) {
        const quoteValue = parseFloat(quoteResult);
        if (quoteValue > 1) {
          // Add to valid pools and mark this pair as "checked"
          validPools.push(pool);
          checkedPairs.add(pairKey); // Avoid future calls for this pair
        }
      }
    } catch (error) {
      console.error(`Error fetching quote for ${pool.dex}`, error);
    }
  }

  console.log(`Fetched quotes for ${validPools.length} valid pools.`);
  return validPools;
}

// Get the network object by chainId
function getNetworkByChainId(chainId: number): INetwork {
  const network = NETWORKS.find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(`Network with chainId ${chainId} not found.`);
  }
  return network;
}

// Run the pool searching and save results to a JSON file
async function runPoolSearching(): Promise<void> {
  try {
    const validPools = await getQuotes();

    const outputPath = path.resolve(__dirname, './generated-data/pool-listing.json');
    fs.writeFileSync(outputPath, JSON.stringify(validPools, null, 2), 'utf-8');

    console.log(`Quotes saved successfully to ${outputPath}. Total pools: ${validPools.length}`);
  } catch (error) {
    console.error('Unexpected error during pool searching:', error);
  }
}

runPoolSearching()
  .then(() => {
    console.log('Pool searching completed.');
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
  });
