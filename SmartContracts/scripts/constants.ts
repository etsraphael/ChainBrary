import dotenv from 'dotenv';
import { Token } from '@uniswap/sdk-core';
import { INetwork, IQuotePayload, NetworkNameList } from './interfaces';

dotenv.config();

// Supported networks
export const NETWORKS: { [key in NetworkNameList]: INetwork } = {
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
export const TOKENS: { [key in string]: { [key in string]: Token } } = {
  POLYGON: {
    USDC: new Token(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
    DAI: new Token(137, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
    WETH: new Token(137, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether')
  },
  ETH: {
    DAI: new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
    USDC: new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
    WETH: new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether')
  },
  BSC: {
    ETH: new Token(56, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'ETH', 'Ethereum'),
    USDT: new Token(56, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD'),
    WBNB: new Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB')
  },
  ARBITRUM: {
    DAI: new Token(42161, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai Stablecoin'),
    USDT: new Token(42161, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 18, 'USDT', 'Tether USD'),
    WETH: new Token(42161, '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', 18, 'WETH', 'Wrapped Ether'),
    USDC: new Token(42161, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, 'USDC', 'USD Coin')
  }
};

// List of token pairs to quote
export const TOKEN_PAIRS: IQuotePayload[] = [
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
    tokenIn: TOKENS.ARBITRUM.WETH,
    tokenOut: TOKENS.ARBITRUM.USDC,
    amountIn: '1',
    fee: 3000
  },
  {
    network: NETWORKS.ETH_MAINNET,
    tokenIn: TOKENS.ETH.WETH,
    tokenOut: TOKENS.ETH.USDC,
    amountIn: '1',
    fee: 3000
  },
  {
    network: NETWORKS.BSC_MAINNET,
    tokenIn: TOKENS.BSC.WBNB,
    tokenOut: TOKENS.BSC.USDT,
    amountIn: '1',
    fee: 3000
  }
];
