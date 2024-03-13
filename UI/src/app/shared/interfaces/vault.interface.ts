import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';

export interface Vault {
  network: NetworkVault;
  data: {
    TVL: number;
    TVS: number;
    fullNetworkReward: number;
    userStaked: number;
    userReward: number;
  } | null;
}

export interface NetworkVault {
  contractAddress: string;
  networkDetail: INetworkDetail;
}

export interface VaultSupported {
  contractAddress: string;
  name: string;
  chainId: NetworkChainId;
  rpcUrl: string;
}
