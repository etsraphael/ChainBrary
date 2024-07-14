import { NetworkChainId } from '@chainbrary/web3-login';

export interface ITokenCreationPayload {
  name: string;
  symbol: string;
  network: NetworkChainId;
  maxSupply: number;
  decimals: number;
  canBurn: boolean;
  canMint: boolean;
  canPause: boolean;
}

export interface ITokenSetup {
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  canMint: boolean;
  canBurn: boolean;
  canPause: boolean;
  owner: string;
  contractAddress: string;
}
