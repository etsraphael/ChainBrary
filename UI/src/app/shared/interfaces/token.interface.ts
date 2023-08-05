import { NetworkChainId } from "@chainbrary/web3-login";

export interface IToken {
  decimals: number;
  name: string;
  symbol: string;
  networkSupport: IContract[];
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
