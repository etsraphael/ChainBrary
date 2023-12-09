import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { IToken } from '../interfaces';
import { TokenPair } from '../enum';

export const tokenList: IToken[] = [
  {
    tokenId: TokenId.ETHEREUM,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    nativeToChainId: NetworkChainId.ETHEREUM,
    networkSupport: [
      {
        chainId: NetworkChainId.BNB,
        address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        priceFeed: [TokenPair.EthToUsd]
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        address: '0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15',
        priceFeed: [TokenPair.EthToUsd]
      }
    ]
  },
  {
    tokenId: TokenId.AVALANCHE,
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    nativeToChainId: NetworkChainId.AVALANCHE,
    networkSupport: []
  },
  {
    tokenId: TokenId.BNB,
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
    nativeToChainId: NetworkChainId.BNB,
    networkSupport: []
  },
  {
    tokenId: TokenId.MATIC,
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    nativeToChainId: NetworkChainId.POLYGON,
    networkSupport: []
  },
  {
    tokenId: TokenId.SEPOLIA,
    name: 'Sepolia',
    symbol: 'SEP',
    decimals: 18,
    nativeToChainId: NetworkChainId.SEPOLIA,
    networkSupport: []
  },
  {
    tokenId: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    networkSupport: [
      {
        chainId: NetworkChainId.ETHEREUM,
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        priceFeed: [TokenPair.UsdcToUsd]
      },
      {
        chainId: NetworkChainId.BNB,
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        priceFeed: [TokenPair.UsdcToUsd]
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        priceFeed: [TokenPair.UsdcToUsd]
      },
      {
        chainId: NetworkChainId.POLYGON,
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        priceFeed: [TokenPair.UsdcToUsd]
      }
    ]
  },
  {
    tokenId: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.BNB,
        address: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
        priceFeed: [TokenPair.DogeToUsd]
      }
    ]
  },
  {
    tokenId: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.BNB,
        address: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
        priceFeed: [TokenPair.DotToUsd]
      }
    ]
  },
  {
    tokenId: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.BNB,
        address: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
        priceFeed: [TokenPair.LinkToUsd]
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        address: '0x5947bb275c521040051d82396192181b413227a3',
        priceFeed: [TokenPair.LinkToUsd]
      },
      {
        chainId: NetworkChainId.POLYGON,
        address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
        priceFeed: [TokenPair.LinkToUsd]
      },
      {
        chainId: NetworkChainId.ETHEREUM,
        address: '0x514910771af9ca656af840dff83e8264ecf986ca',
        priceFeed: [TokenPair.LinkToUsd]
      }
    ]
  },
  {
    tokenId: 'wbitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.ETHEREUM,
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        priceFeed: []
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        address: '0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab',
        priceFeed: [TokenPair.WbtcToUsd]
      },
      {
        chainId: NetworkChainId.POLYGON,
        address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
        priceFeed: [TokenPair.WbtcToUsd]
      }
    ]
  },
  {
    tokenId: 'the-graph',
    name: 'The Graph',
    symbol: 'GRT',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.ETHEREUM,
        address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
        priceFeed: [TokenPair.GrtToUsd]
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        address: '0x8a0cAc13c7da965a312f08ea4229c37869e85cB9',
        priceFeed: []
      }
    ]
  },
  {
    tokenId: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.BNB,
        address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
        priceFeed: [TokenPair.AdaToUsd]
      }
    ]
  },
  {
    tokenId: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.BNB,
        address: '0x0eb3a705fc54725037cc9e008bdede697f62f335',
        priceFeed: [TokenPair.AtomToUsd]
      },
      {
        chainId: NetworkChainId.ETHEREUM,
        address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
        priceFeed: [TokenPair.AtomToUsd]
      },
      {
        chainId: NetworkChainId.POLYGON,
        address: '0xac51C4c48Dc3116487eD4BC16542e27B5694Da1b',
        priceFeed: []
      }
    ]
  },
  {
    tokenId: 'chainBrary',
    name: 'ChainBrary',
    symbol: 'CB',
    decimals: 18,
    networkSupport: [
      {
        chainId: NetworkChainId.SEPOLIA,
        address: '0x75eC33387b1b309359598bf1Cc75E4823807F281',
        priceFeed: []
      },
      {
        chainId: NetworkChainId.LOCALHOST,
        address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        priceFeed: []
      }
    ]
  },
  {
    tokenId: TokenId.ETHEREUM,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    nativeToChainId: NetworkChainId.LOCALHOST,
    networkSupport: []
  }
];
