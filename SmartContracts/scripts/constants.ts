import dotenv from 'dotenv';
import { Token } from '@uniswap/sdk-core';
import { INetwork, NetworkNameList } from './interfaces';

dotenv.config();

// Supported networks
export const NETWORKS: { [key: string]: INetwork } = {
  [NetworkNameList.POLYGON_MAINNET]: {
    chainId: 137,
    rpcUrl: process.env.POLY_MAINNET_URL as string,
    name: 'Polygon Mainnet'
  },
  [NetworkNameList.BSC_MAINNET]: {
    chainId: 56,
    rpcUrl: process.env.BSC_MAINNET_URL as string,
    name: 'Binance Smart Chain Mainnet'
  },
  [NetworkNameList.ETH_MAINNET]: {
    chainId: 1,
    rpcUrl: process.env.ETH_MAINNET_URL as string,
    name: 'Ethereum Mainnet'
  },
  [NetworkNameList.ARBITRUM_MAINNET]: {
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_MAINNET_URL as string,
    name: 'Arbitrum Mainnet'
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
    USDC: new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  },
  BSC: {
    ETH: new Token(56, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'ETH', 'Ethereum'),
    USDT: new Token(56, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD')
  },
  ARBITRUM: {
    DAI: new Token(42161, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai Stablecoin'),
    USDT: new Token(42161, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 18, 'USDT', 'Tether USD')
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
  },
  {
    network: NETWORKS.BSC_MAINNET,
    tokenIn: TOKENS.BSC.USDT,
    tokenOut: TOKENS.BSC.ETH,
    amountIn: '1',
    fee: 3000
  },
  {
    network: NETWORKS.ARBITRUM_MAINNET,
    tokenIn: TOKENS.ARBITRUM.USDT,
    tokenOut: TOKENS.ARBITRUM.DAI,
    amountIn: '1',
    fee: 3000
  }
];
