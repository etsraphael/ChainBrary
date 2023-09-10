import { INetworkDetail, NetworkChainCode, NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { IConversionToken, IToken, StoreState } from './../../src/app/shared/interfaces';

export const currentNetworkSample: INetworkDetail = {
  chainId: NetworkChainId.SEPOLIA,
  chainCode: NetworkChainCode.SEPOLIA,
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

export const paymentConversionStoreSample: StoreState<IConversionToken> = {
  data: {
    usdAmount: 100,
    tokenAmount: 1,
    priceInUsdEnabled: true
  },
  loading: false,
  error: null
};

export const tokenSample: IToken = {
  tokenId: TokenId.SEPOLIA,
  name: 'Sepolia',
  symbol: 'SEP',
  decimals: 18,
  nativeToChainId: NetworkChainId.SEPOLIA,
  networkSupport: []
};
