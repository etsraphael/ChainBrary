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
