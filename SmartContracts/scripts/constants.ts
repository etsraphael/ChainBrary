import dotenv from 'dotenv';
import { Token } from '@uniswap/sdk-core';

dotenv.config();

// Supported networks
export const NETWORKS = {
  POLYGON_MAINNET: {
    chainId: 137,
    rpcUrl: process.env.POLY_MAINNET_URL as string,
    name: 'Polygon Mainnet'
  },
  BSC_MAINNET: {
    chainId: 56,
    rpcUrl: process.env.BSC_MAINNET_URL as string,
    name: 'Binance Smart Chain Mainnet'
  },
  ETH_MAINNET: {
    chainId: 1,
    rpcUrl: process.env.ETH_MAINNET_URL as string,
    name: 'Ethereum Mainnet'
  }
};

// Supported tokens
export const TOKENS = {
  POLYGON: {
    USDC: new Token(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
    DAI: new Token(137, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
    WETH: new Token(137, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether')
  },
  ETH: {
    DAI: new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
    USDC: new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
  }
};

// List of token pairs to quote
export const TOKEN_PAIRS = [
  {
    network: NETWORKS.POLYGON_MAINNET,
    tokenIn: TOKENS.POLYGON.USDC,
    tokenOut: TOKENS.POLYGON.DAI,
    amountIn: '1',
    fee: 3000
  },
  {
    network: NETWORKS.POLYGON_MAINNET,
    tokenIn: TOKENS.POLYGON.WETH,
    tokenOut: TOKENS.POLYGON.USDC,
    amountIn: '1',
    fee: 3000
  },
  {
    network: NETWORKS.ETH_MAINNET,
    tokenIn: TOKENS.ETH.USDC,
    tokenOut: TOKENS.ETH.DAI,
    amountIn: '1',
    fee: 3000
  }

];
