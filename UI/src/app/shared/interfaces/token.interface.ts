export interface IToken {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

export interface IContract {
  chainId: string;
  address: string;
}

export interface INativeToken {
  decimals: number;
  name: string;
  symbol: string;
}
