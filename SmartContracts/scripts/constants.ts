import dotenv from 'dotenv';
import { Token } from '@uniswap/sdk-core';

dotenv.config();

// Supported networks
export const NETWORKS = {
  POLYGON_MAINNET: {
    chainId: 137,
    rpcUrl: process.env.POLY_MAINNET_URL as string,
    name: 'Polygon Mainnet'
  }
};

// Supported tokens
export const TOKENS = {
  POLYGON: {
    USDC: new Token(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
    DAI: new Token(137, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
    WETH: new Token(137, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether')
    // Add more tokens as needed
  }
};

// List of token pairs to quote
export const TOKEN_PAIRS = [
  {
    network: NETWORKS.POLYGON_MAINNET,
    tokenIn: TOKENS.POLYGON.USDC,
    tokenOut: TOKENS.POLYGON.DAI,
    amountIn: '100',
    fee: 3000
  },
  {
    network: NETWORKS.POLYGON_MAINNET,
    tokenIn: TOKENS.POLYGON.WETH,
    tokenOut: TOKENS.POLYGON.USDC,
    amountIn: '1',
    fee: 3000
  }
];
