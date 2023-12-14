import { INetworkDetail, NetworkVersion, NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { IConversionToken, IToken, StoreState } from './../../src/app/shared/interfaces';
import { DataConversionStore } from './../../src/app/store/payment-request-store/state/selectors';

export const currentNetworkSample: INetworkDetail = {
  chainId: NetworkChainId.SEPOLIA,
  networkVersion: NetworkVersion.SEPOLIA,
  name: 'Sepolia',
  shortName: 'Sepolia',
  nativeCurrency: {
    id: TokenId.SEPOLIA,
    name: 'Sepolia',
    symbol: 'SEP',
    decimals: 18
  },
  blockExplorerUrls: 'https://sepolia.etherscan.io',
  rpcUrls: [NetworkChainId.SEPOLIA]
};

export const paymentConversionStoreSample: DataConversionStore = {
  conversionToken: {
    loading: false,
    error: null,
    data: 1
  },
  conversionUSD: {
    loading: false,
    error: null,
    data: 1
  }
};

export const tokenSample: IToken = {
  tokenId: TokenId.SEPOLIA,
  name: 'Sepolia',
  symbol: 'SEP',
  decimals: 18,
  nativeToChainId: NetworkChainId.SEPOLIA,
  networkSupport: []
};
