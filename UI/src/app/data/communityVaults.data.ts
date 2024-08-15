import { NetworkChainId } from '@chainbrary/web3-login';
import { VaultSupported } from '../shared/interfaces';
import { environment } from './../../environments/environment';
import { isDevMode } from '@angular/core';

export const communityVaults: VaultSupported[] = [
  ...(isDevMode() === true
    ? [
        {
          contractAddress: environment.contracts.communityVault.contracts.find(
            (contract) => contract.chainId === NetworkChainId.LOCALHOST
          )?.address as string,
          name: 'LocalHost network',
          chainId: NetworkChainId.LOCALHOST,
          rpcUrl: 'http://127.0.0.1:8545',
          icon: 'eth-icon.svg'
        }
      ]
    : []),
  ...(environment.environmentName === 'production'
    ? []
    : [
        {
          contractAddress: environment.contracts.communityVault.contracts.find(
            (contract) => contract.chainId === NetworkChainId.SEPOLIA
          )?.address as string,
          name: 'Sepolia network',
          chainId: NetworkChainId.SEPOLIA,
          rpcUrl: environment.rpcKeys.sepolia,
          icon: 'eth-icon.svg'
        }
      ]),
  {
    contractAddress: environment.contracts.communityVault.contracts.find(
      (contract) => contract.chainId === NetworkChainId.POLYGON
    )?.address as string,
    name: 'Polygon network',
    chainId: NetworkChainId.POLYGON,
    rpcUrl: environment.rpcKeys.polygon,
    icon: 'matic-icon.svg'
  },
  {
    contractAddress: environment.contracts.communityVault.contracts.find(
      (contract) => contract.chainId === NetworkChainId.AVALANCHE
    )?.address as string,
    name: 'Avalanche network',
    chainId: NetworkChainId.AVALANCHE,
    rpcUrl: environment.rpcKeys.avalanche,
    icon: 'avax-icon.svg'
  },
  {
    contractAddress: environment.contracts.communityVault.contracts.find(
      (contract) => contract.chainId === NetworkChainId.BNB
    )?.address as string,
    name: 'Binance network',
    chainId: NetworkChainId.BNB,
    rpcUrl: environment.rpcKeys.bnb,
    icon: 'bnb-icon.svg'
  }
];
