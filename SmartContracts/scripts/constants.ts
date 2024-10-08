import dotenv from 'dotenv';
import { Token } from '@uniswap/sdk-core';
import { DEX, INetwork, IQuotePayload, NetworkNameList } from './interfaces';

dotenv.config();

// Supported networks
export const NETWORKS: INetwork[] = [
  {
    chainId: 137,
    rpcUrl: process.env.POLY_MAINNET_URL as string,
    name: 'Polygon Mainnet',
    networkName: NetworkNameList.POLYGON_MAINNET
  },
  {
    chainId: 56,
    rpcUrl: process.env.BSC_MAINNET_URL as string,
    name: 'Binance Smart Chain Mainnet',
    networkName: NetworkNameList.BSC_MAINNET
  },
  {
    chainId: 1,
    rpcUrl: process.env.ETH_MAINNET_URL as string,
    name: 'Ethereum Mainnet',
    networkName: NetworkNameList.ETH_MAINNET
  },
  {
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_MAINNET_URL as string,
    name: 'Arbitrum Mainnet',
    networkName: NetworkNameList.ARBITRUM_MAINNET
  }
];

// Supported tokens
export const TOKENS: { [key in string]: { [key in string]: Token } } = {
  POLYGON: {
    USDC: new Token(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
    DAI: new Token(137, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
    WETH: new Token(137, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
    LINK: new Token(137, '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', 18, 'LINK', 'Chainlink'),
    WBTC: new Token(137, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped Bitcoin')
  },
  ETH: {
    DAI: new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
    USDC: new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
    WETH: new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    WBTC: new Token(1, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped Bitcoin')
  },
  BSC: {
    ETH: new Token(56, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'ETH', 'Ethereum'),
    USDT: new Token(56, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD'),
    WBNB: new Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    FLUX: new Token(56, '0xaff9084f2374585879e8b434c399e29e80cce635', 18, 'FLUX', 'Flux Protocol'),
    DOGE: new Token(56, '0xba2ae424d960c26247dd6c32edc70b295c744c43', 8, 'DOGE', 'Dogecoin'),
    DOT: new Token(56, '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', 18, 'DOT', 'Polkadot')
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
    network: getNetworkByName(NetworkNameList.POLYGON_MAINNET),
    tokenIn: TOKENS.POLYGON.WETH,
    tokenOut: TOKENS.POLYGON.USDC,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.BSC_MAINNET),
    tokenIn: TOKENS.BSC.ETH,
    tokenOut: TOKENS.BSC.USDT,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.ARBITRUM_MAINNET),
    tokenIn: TOKENS.ARBITRUM.WETH,
    tokenOut: TOKENS.ARBITRUM.USDC,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.ETH_MAINNET),
    tokenIn: TOKENS.ETH.WETH,
    tokenOut: TOKENS.ETH.USDC,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.ETH_MAINNET),
    tokenIn: TOKENS.ETH.WBTC,
    tokenOut: TOKENS.ETH.USDC,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.BSC_MAINNET),
    tokenIn: TOKENS.BSC.WBNB,
    tokenOut: TOKENS.BSC.USDT,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.POLYGON_MAINNET),
    tokenIn: TOKENS.POLYGON.LINK,
    tokenOut: TOKENS.POLYGON.WETH,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.POLYGON_MAINNET),
    tokenIn: TOKENS.POLYGON.WBTC,
    tokenOut: TOKENS.POLYGON.WETH,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.BSC_MAINNET),
    tokenIn: TOKENS.BSC.FLUX,
    tokenOut: TOKENS.BSC.WBNB,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.BSC_MAINNET),
    tokenIn: TOKENS.BSC.WBNB,
    tokenOut: TOKENS.BSC.DOGE,
    amountIn: '1',
    fee: 100
  },
  {
    network: getNetworkByName(NetworkNameList.BSC_MAINNET),
    tokenIn: TOKENS.BSC.DOT,
    tokenOut: TOKENS.BSC.USDT,
    amountIn: '1',
    fee: 100
  }
];

// Helper function to get network by networkName
function getNetworkByName(networkName: NetworkNameList): INetwork {
  const network = NETWORKS.find((n) => n.networkName === networkName);
  if (!network) {
    throw new Error(`Network ${networkName} not found`);
  }
  return network;
}

export function routerContracts(dex: DEX): { [chainId: number]: string } | null {
  switch (dex) {
    case DEX.UNISWAP_V3:
      return {
        1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
        137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon Mainnet
        56: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7', // BSC Mainnet
        10: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Optimism Mainnet
        42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Arbitrum Mainnet
        42220: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc' // Celo Mainnet
      };
    case DEX.SUSHISWAP_V2:
      return {
        1: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', // Ethereum Mainnet
        137: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // Polygon Mainnet
        56: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // BSC Mainnet
        42161: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506' // Arbitrum Mainnets
      };
    case DEX.PANCAKESWAP_V2:
      return {
        1: '0xEfF92A263d31888d860bD50809A8D171709b7b1c', // Ethereum Mainnet
        56: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // BSC Mainnet
        42161: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb' // Arbitrum Mainnets
      };
    case DEX.PANCAKESWAP_V3:
      return {
        56: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865' // BSC Mainnet
      };
    default:
      return null;
  }
}
