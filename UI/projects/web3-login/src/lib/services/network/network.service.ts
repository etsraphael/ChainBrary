import { Inject, Injectable } from '@angular/core';
import {
  INetworkDetail,
  NetworkChainId,
  NetworkRpcUrlSupported,
  NetworkVersion,
  TokenId,
  Web3LoginConfig
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NetworkServiceWeb3Login {
  constructor(@Inject('config') private config: Web3LoginConfig) {}

  getNetworkDetailByChainId(chainId: string | null): INetworkDetail {
    const networkDetailList: INetworkDetail[] = this.getNetworkDetailList();
    if (chainId) {
      const networkDetail: INetworkDetail | undefined = networkDetailList.find(
        (network: INetworkDetail) => network.chainId === chainId
      );
      if (networkDetail) {
        return {
          ...networkDetail,
          rpcUrls: this.config.networkSupported.find(
            (network: NetworkRpcUrlSupported) => network.chainId === networkDetail.chainId
          )?.rpcUrl
        };
      }
    }
    return {
      chainId: NetworkChainId.UNKNOWN,
      networkVersion: NetworkVersion.UNKNOWN,
      name: 'Unknown',
      shortName: 'unknown',
      nativeCurrency: {
        id: TokenId.UNKNOWN,
        name: 'Unknown',
        symbol: 'UNK',
        decimals: 18
      },
      blockExplorerUrls: '',
      rpcUrls: ['']
    };
  }

  getNetworkDetailByNetworkVersion(networkVersion: string): INetworkDetail {
    const networkDetailList: INetworkDetail[] = this.getNetworkDetailList();
    const networkDetail: INetworkDetail | undefined = networkDetailList.find(
      (network: INetworkDetail) => network.networkVersion === networkVersion
    );
    if (networkDetail) {
      return {
        ...networkDetail,
        rpcUrls: this.config.networkSupported.find(
          (network: NetworkRpcUrlSupported) => network.chainId === networkDetail.chainId
        )?.rpcUrl
      };
    }
    return {
      chainId: NetworkChainId.UNKNOWN,
      networkVersion: NetworkVersion.UNKNOWN,
      name: 'Unknown',
      shortName: 'unknown',
      nativeCurrency: {
        id: TokenId.UNKNOWN,
        name: 'Unknown',
        symbol: 'UNK',
        decimals: 18
      },
      blockExplorerUrls: '',
      rpcUrls: ['']
    };
  }

  getNetworkDetailList(): INetworkDetail[] {
    return [
      {
        chainId: NetworkChainId.ETHEREUM,
        networkVersion: NetworkVersion.ETHEREUM,
        name: 'Ethereum Mainnet',
        shortName: 'Ethereum',
        nativeCurrency: {
          id: TokenId.ETHEREUM,
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        blockExplorerUrls: 'https://etherscan.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.ETHEREUM)
      },
      {
        chainId: NetworkChainId.BNB,
        networkVersion: NetworkVersion.BNB,
        name: 'Binance Smart Chain Mainnet',
        shortName: 'BNB Chain',
        nativeCurrency: {
          id: TokenId.BNB,
          name: 'Binance Chain Native Token',
          symbol: 'BNB',
          decimals: 18
        },
        blockExplorerUrls: 'https://bscscan.com',
        rpcUrls: this.getRpcUrl(NetworkChainId.BNB)
      },
      {
        chainId: NetworkChainId.SEPOLIA,
        networkVersion: NetworkVersion.SEPOLIA,
        name: 'Sepolia',
        shortName: 'Sepolia',
        nativeCurrency: {
          id: TokenId.SEPOLIA,
          name: 'Sepolia',
          symbol: 'SEP',
          decimals: 18
        },
        blockExplorerUrls: 'https://sepolia.etherscan.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.SEPOLIA)
      },
      {
        chainId: NetworkChainId.ARBITRUM,
        networkVersion: NetworkVersion.ARBITRUM,
        name: 'Arbitrum One',
        shortName: 'Arbitrum',
        nativeCurrency: {
          id: TokenId.ARBITRUM,
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        blockExplorerUrls: 'https://arbiscan.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.ARBITRUM)
      },
      {
        chainId: NetworkChainId.POLYGON,
        networkVersion: NetworkVersion.POLYGON,
        name: 'Polygon',
        shortName: 'Polygon',
        nativeCurrency: {
          id: TokenId.MATIC,
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18
        },
        blockExplorerUrls: 'https://www.polygonscan.com',
        rpcUrls: this.getRpcUrl(NetworkChainId.POLYGON)
      },
      {
        chainId: NetworkChainId.OPTIMISM,
        networkVersion: NetworkVersion.OPTIMISM,
        name: 'Optimism',
        shortName: 'Optimism',
        nativeCurrency: {
          id: TokenId.ETHEREUM,
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        blockExplorerUrls: 'https://optimistic.etherscan.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.OPTIMISM)
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        networkVersion: NetworkVersion.AVALANCHE,
        name: 'Avalanche',
        shortName: 'Avalanche',
        nativeCurrency: {
          id: TokenId.AVALANCHE,
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18
        },
        blockExplorerUrls: 'https://snowtrace.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.AVALANCHE)
      },
      {
        chainId: NetworkChainId.MOONBEAM,
        networkVersion: NetworkVersion.MOONBEAM,
        name: 'Moonbeam',
        shortName: 'Moonbeam',
        nativeCurrency: {
          id: TokenId.MOONBEAM,
          name: 'Moonbeam',
          symbol: 'GLMR',
          decimals: 18
        },
        blockExplorerUrls: 'https://moonbeam.moonscan.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.MOONBEAM)
      },
      {
        chainId: NetworkChainId.KAVA,
        networkVersion: NetworkVersion.KAVA,
        name: 'KAVA',
        shortName: 'KAVA',
        nativeCurrency: {
          id: TokenId.KAVA,
          name: 'KAVA',
          symbol: 'KAVA',
          decimals: 18
        },
        blockExplorerUrls: 'https://explorer.kava.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.KAVA)
      },
      {
        chainId: NetworkChainId.FANTOM,
        networkVersion: NetworkVersion.FANTOM,
        name: 'Fantom',
        shortName: 'Fantom',
        nativeCurrency: {
          id: TokenId.FANTOM,
          name: 'Fantom',
          symbol: 'FTM',
          decimals: 18
        },
        blockExplorerUrls: 'https://ftmscan.com',
        rpcUrls: this.getRpcUrl(NetworkChainId.FANTOM)
      },
      {
        chainId: NetworkChainId.CELO,
        networkVersion: NetworkVersion.CELO,
        name: 'Celo',
        shortName: 'Celo',
        nativeCurrency: {
          id: TokenId.CELO,
          name: 'Celo',
          symbol: 'CELO',
          decimals: 18
        },
        blockExplorerUrls: 'https://celoscan.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.CELO)
      },
      {
        chainId: NetworkChainId.LOCALHOST,
        networkVersion: NetworkVersion.LOCALHOST,
        name: 'Localhost',
        shortName: 'Localhost',
        nativeCurrency: {
          id: TokenId.ETHEREUM,
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        blockExplorerUrls: 'https://etherscan.io',
        rpcUrls: this.getRpcUrl(NetworkChainId.LOCALHOST)
      }
    ];
  }

  private getRpcUrl(chainId: NetworkChainId): string[] {
    const urls = this.config.networkSupported.find((network: NetworkRpcUrlSupported) => network.chainId === chainId)
      ?.rpcUrl;
    return urls || [];
  }
}
