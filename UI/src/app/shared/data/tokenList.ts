import { IToken } from '../interfaces';

export const tokenList: IToken[] = [
  {
    chainId: 1,
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    name: 'Chainlink',
    symbol: 'LINK',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700'
  },
  {
    chainId: 1,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734'
  },
  {
    chainId: 1,
    address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    name: 'Shiba Inu',
    symbol: 'SHIB',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png?1622619446'
  }
];
