import { NetworkChainId } from '@chainbrary/web3-login';
import { TokenPair } from '../enum';

export interface IToken {
  tokenId: string | null;
  decimals: number;
  name: string;
  symbol: string;
  networkSupport: ITokenContract[];
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
