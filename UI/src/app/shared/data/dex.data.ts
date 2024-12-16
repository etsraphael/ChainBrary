import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { tokenList } from './tokenList';
import { IToken } from '../interfaces';

const findTokenById = (tokenId: TokenId | string): IToken | undefined => {
  return tokenList.find((token: IToken) => token.tokenId === tokenId);
};

export const DefaultNetworkPairs: DefaultNetworkPair[] = [
  {
    chainId: NetworkChainId.LOCALHOST,
    token1: {
      tokenId: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      decimals: 18,
      name: 'Custom Token 1',
      symbol: 'CT1',
      networkSupport: [
        {
          chainId: NetworkChainId.LOCALHOST,
          address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
          priceFeed: []
        }
      ]
    },
    token2: {
      tokenId: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      decimals: 18,
      name: 'Custom Token 2',
      symbol: 'CT2',
      networkSupport: [
        {
          chainId: NetworkChainId.LOCALHOST,
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          priceFeed: []
        }
      ]
    }
  },
  {
    chainId: NetworkChainId.SEPOLIA,
    token1: {
      tokenId: '0x332cc82837b1E75600e31D231D42f6Ac36c899A8',
      decimals: 18,
      name: 'Custom Token 1',
      symbol: 'CT1',
      networkSupport: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x332cc82837b1E75600e31D231D42f6Ac36c899A8',
          priceFeed: []
        }
      ]
    },
    token2: {
      tokenId: '0x4566A56531CD978829a6EB1565F39E4892377C55',
      decimals: 18,
      name: 'Custom Token 2',
      symbol: 'CT2',
      networkSupport: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x4566A56531CD978829a6EB1565F39E4892377C55',
          priceFeed: []
        }
      ]
    }
  },
  {
    chainId: NetworkChainId.POLYGON,
    token1: findTokenById('chainlink') as IToken,
    token2: findTokenById('usdc') as IToken
  },
  {
    chainId: NetworkChainId.ETHEREUM,
    token1: findTokenById(TokenId.ETHEREUM) as IToken,
    token2: findTokenById('usdc') as IToken
  }
];

export interface DefaultNetworkPair {
  chainId: NetworkChainId;
  token1: IToken;
  token2: IToken;
}
