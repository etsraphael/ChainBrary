import { INetworkDetail } from '@chainbrary/web3-login';

export interface Vault {
  network: NetworkVault;
  TVL: number;
}

export interface NetworkVault {
  contractAddress: string;
  networkDetail: INetworkDetail;
}
