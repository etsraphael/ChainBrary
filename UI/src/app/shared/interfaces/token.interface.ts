import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { TokenPair } from '../enum';

export interface IToken {
  tokenId: TokenId | string;
  decimals: number;
  name: string;
  symbol: string;
  networkSupport: ITokenContract[];
  nativeToChainId?: NetworkChainId;
}

export interface ITokenContract {
  chainId: NetworkChainId;
  address: string;
  priceFeed: TokenPair[];
}

export interface IContract {
  chainId: NetworkChainId;
  address: string;
}

export interface INativeToken {
  decimals: number;
  name: string;
  symbol: string;
}
