// pool-listing.ts
import fs from 'fs';
import path from 'path';
import { NETWORKS, TOKENS, routerContracts } from './constants';
import { DEX, IDexPool, INetwork, QuotePayload, QuoteResult } from './interfaces';
import { getQuote } from './quote-request';
import { FeeAmount } from '@uniswap/v3-sdk';

// Define fee tiers per DEX
const dexFeeTiers: { [dex in DEX]: number[] } = {
  [DEX.UNISWAP_V3]: [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM], // Uniswap V3 fee tiers in basis points
  [DEX.PANCAKESWAP_V3]: [FeeAmount.LOWEST, 2500, FeeAmount.HIGH], // PancakeSwap V3 fee tiers
  [DEX.SUSHISWAP_V3]: [FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH] // SushiSwap V3 fee tiers (adjust as per actual values)
};

function generateAllPools(): IDexPool[] {
  const pools: IDexPool[] = [];

  for (const tokenIn of TOKENS) {
    for (const tokenOut of TOKENS) {
      if (tokenIn.address === tokenOut.address || tokenIn.chainId !== tokenOut.chainId) {
        continue; // Skip identical tokens or tokens on different chains
      }

      const network = getNetworkByChainId(tokenIn.chainId);

      for (const dex of [DEX.UNISWAP_V3, DEX.PANCAKESWAP_V3, DEX.SUSHISWAP_V3]) {
        const feeTiers = dexFeeTiers[dex] || [];
        const router = routerContracts(dex);
        if (router && router[network.chainId]) {
          for (const fee of feeTiers) {
            pools.push({
              network,
              tokenIn,
              tokenOut,
              amountIn: '1',
              fee,
              dex,
              type: 'BUY'
            });
          }
        }
      }
    }
  }

  console.log('Total pools generated:', pools.length);
  return pools;
}

async function getQuotes(): Promise<IDexPool[]> {
  const pools = generateAllPools();
  const validPools: IDexPool[] = [];
  const checkedPairs: Set<string> = new Set();

  console.log(`Fetching quotes for ${pools.length} pools...`);

  for (const pool of pools) {
    const pairKey = `${pool.tokenIn.symbol}-${pool.tokenOut.symbol}-${pool.dex}-${pool.fee}`;

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
      const quoteResult: QuoteResult | null = await getQuote(payload);
      if (quoteResult) {
        const quoteValue = parseFloat(quoteResult.amountOut);
        if (quoteValue > 0) {
          validPools.push(pool);
          checkedPairs.add(pairKey);
        }
      }
    } catch (error) {
      console.error(`Error fetching quote for ${pairKey}`, error);
    }
  }

  console.log(`Fetched quotes for ${validPools.length} valid pools.`);
  return validPools;
}

function getNetworkByChainId(chainId: number): INetwork {
  const network = NETWORKS.find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(`Network with chainId ${chainId} not found.`);
  }
  return network;
}

async function runPoolSearching(): Promise<void> {
  try {
    const validPools = await getQuotes();

    const outputDir = path.resolve(__dirname, './generated-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputPath = path.resolve(outputDir, 'pool-listing.json');
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
