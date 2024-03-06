import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';

export interface Vault {
  network: NetworkVault;
  TVL: number;
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
