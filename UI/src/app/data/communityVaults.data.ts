import { NetworkChainId } from '@chainbrary/web3-login';
import { VaultSupported } from '../shared/interfaces';
import { environment } from './../../environments/environment';

export const communityVaults: VaultSupported[] = [
  {
    contractAddress: environment.contracts.communityVault.contracts.find(
      (contract) => contract.chainId === NetworkChainId.SEPOLIA
    )?.address as string,
    name: 'Sepolia network',
    chainId: NetworkChainId.SEPOLIA,
    rpcUrl: environment.rpcKeys.sepolia
  },
  {
    contractAddress: environment.contracts.communityVault.contracts.find(
      (contract) => contract.chainId === NetworkChainId.POLYGON
    )?.address as string,
    name: 'Polygon network',
    chainId: NetworkChainId.POLYGON,
    rpcUrl: environment.rpcKeys.polygon
  },
  {
    contractAddress: environment.contracts.communityVault.contracts.find(
      (contract) => contract.chainId === NetworkChainId.LOCALHOST
    )?.address as string,
    name: 'LocalHost network',
    chainId: NetworkChainId.LOCALHOST,
    rpcUrl: 'http://127.0.0.1:8545'
  }
];
