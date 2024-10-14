import dotenv from 'dotenv';
import { Token } from '@uniswap/sdk-core';
import { DEX, INetwork, IDexPool, NetworkNameList } from './interfaces';

dotenv.config();

// Supported networks
export const NETWORKS: INetwork[] = [
  {
    chainId: 137,
    rpcUrl: process.env.POLY_MAINNET_URL as string,
    networkName: NetworkNameList.POLYGON_MAINNET
  },
  {
    chainId: 56,
    rpcUrl: process.env.BSC_MAINNET_URL as string,
    networkName: NetworkNameList.BSC_MAINNET
  },
  {
    chainId: 1,
    rpcUrl: process.env.ETH_MAINNET_URL as string,
    networkName: NetworkNameList.ETH_MAINNET
  },
  {
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_MAINNET_URL as string,
    networkName: NetworkNameList.ARBITRUM_MAINNET
  }
];

// Supported tokens
export const TOKENS: Token[] = [
  new Token(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
  new Token(137, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
  new Token(137, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
  new Token(137, '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', 18, 'LINK', 'Chainlink'),
  new Token(137, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped Bitcoin'),
  new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
  new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
  new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
  new Token(1, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped Bitcoin'),
  new Token(1, '0x514910771af9ca656af840dff83e8264ecf986ca', 18, 'LINK', 'Chainlink'),
  new Token(1, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 'USDT', 'Tether USD'),
  new Token(56, '0x2170ed0880ac9a755fd29b2688956bd959f933f8', 18, 'WETH', 'Ethereum'),
  new Token(56, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD'),
  new Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
  new Token(56, '0xaff9084f2374585879e8b434c399e29e80cce635', 18, 'FLUX', 'Flux Protocol'),
  new Token(56, '0xba2ae424d960c26247dd6c32edc70b295c744c43', 8, 'DOGE', 'Dogecoin'),
  new Token(56, '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', 18, 'DOT', 'Polkadot'),
  new Token(42161, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai Stablecoin'),
  new Token(42161, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 18, 'USDT', 'Tether USD'),
  new Token(42161, '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', 18, 'WETH', 'Wrapped Ether'),
  new Token(42161, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, 'USDC', 'USD Coin')
];

export function routerContracts(dex: DEX): { [chainId: number]: string } | null {
  switch (dex) {
    case DEX.UNISWAP_V3:
      return {
        1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
        // 137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon Mainnet
        56: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7', // BSC Mainnet
        // 10: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Optimism Mainnet
        42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984' // Arbitrum Mainnet
        // 42220: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc' // Celo Mainnet
      };
    case DEX.PANCAKESWAP_V3:
      return {
        1: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865', // Ethereum Mainnet
        56: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865', // BSC Mainnet,
        42161: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865' // Arbitrum Mainnet
      };
    default:
      return null;
  }
}
