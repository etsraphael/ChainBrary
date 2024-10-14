import { Token } from '@uniswap/sdk-core';
import cliProgress from 'cli-progress';
import fs from 'fs';
import path from 'path';
import { NETWORKS, TOKENS } from './constants';
import { DEX, IDexPool, INetwork, QuotePayload, QuoteResult, UniswapFee } from './interfaces';
import { getQuote } from './quote-request';

// Generate all possible token pairs and pool configurations
function generateAllPools(): IDexPool[] {
  const pools: IDexPool[] = [];

  for (const tokenIn of TOKENS) {
    for (const tokenOut of TOKENS) {
      if (tokenIn.address === tokenOut.address || tokenIn.chainId !== tokenOut.chainId) {
        continue; // Skip identical tokens or tokens on different chains
      }

      for (const fee of Object.values(UniswapFee)) {
        const network = getNetworkByChainId(tokenIn.chainId);

        for (const dex of [DEX.UNISWAP_V3, DEX.PANCAKESWAP_V3]) {
          pools.push({
            network,
            tokenIn,
            tokenOut,
            amountIn: '1',
            fee: Number(fee),
            dex
          });
        }
      }
    }
  }
  return pools;
}

// Retrieve quotes for the generated pools
async function getQuotes(): Promise<IDexPool[]> {
  const pools = generateAllPools();
  const validPools: IDexPool[] = [];
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
      dex: pool.dex
    };

    try {
      const quoteResult = await getQuote(payload);
      if (quoteResult) {
        validPools.push(pool); // Store only pools with valid quotes
      }
    } catch (error) {
      console.error(`Error fetching quote for ${pool.dex}`, error);
    }

    progressBar.increment();
  }

  progressBar.stop();
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

    console.log(`Quotes saved successfully to ${outputPath}`);
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
