import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';

export interface Vault {
  network: NetworkVault;
  TVL: number;
  TVS: number;
  fullNetworkReward: number;
  userStaked: number;
  userReward: number;
}

export interface NetworkVault {
  contractAddress: string;
  networkDetail: INetworkDetail;
}

export interface VaultSupported {
  txnHash: string;
  name: string;
  chainId: NetworkChainId;
  rpcUrl: string;
}
