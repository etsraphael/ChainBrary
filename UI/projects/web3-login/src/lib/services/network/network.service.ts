import { Inject, Injectable } from '@angular/core';
import {
  INetworkDetail,
  NetworkChainCode,
  NetworkChainId,
  NetworkRpcUrlSupported,
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
      chainCode: NetworkChainCode.UNKNOWN,
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

  getNetworkDetailByChainCode(chainCode: string): INetworkDetail {
    const networkDetailList: INetworkDetail[] = this.getNetworkDetailList();
    const networkDetail: INetworkDetail | undefined = networkDetailList.find(
      (network: INetworkDetail) => network.chainCode === chainCode
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
      chainCode: NetworkChainCode.UNKNOWN,
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
        chainCode: NetworkChainCode.ETHEREUM,
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
        chainCode: NetworkChainCode.BNB,
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
        chainCode: NetworkChainCode.SEPOLIA,
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
        chainCode: NetworkChainCode.ARBITRUM,
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
        chainCode: NetworkChainCode.POLYGON,
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
        chainCode: NetworkChainCode.OPTIMISM,
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
        chainCode: NetworkChainCode.AVALANCHE,
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
        chainCode: NetworkChainCode.MOONBEAM,
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
        chainCode: NetworkChainCode.KAVA,
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
        chainCode: NetworkChainCode.FANTOM,
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
        chainCode: NetworkChainCode.CELO,
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
      }
    ];
  }

  private getRpcUrl(chainId: NetworkChainId): string[] {
    const urls = this.config.networkSupported.find((network: NetworkRpcUrlSupported) => network.chainId === chainId)
      ?.rpcUrl;
    return urls || [];
  }
}
