import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { tokenList } from '../shared/data/tokenList';
import { IToken } from '../shared/interfaces';

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
