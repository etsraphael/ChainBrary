import '@angular/compiler';
import { INetworkDetail, NetworkChainId, NetworkVersion, TokenId } from '@chainbrary/web3-login';

type EthereumRequest = {
  method: string;
};

type CallbackFunction = (event: string) => void;

type EthereumStub = {
  isMetaMask: boolean;
  chainId: string;
  request: (request: EthereumRequest) => Promise<string[] | string>;
  on: (event: string, callback: CallbackFunction) => void;
  addListener: (event: string, callback: CallbackFunction) => void;
  removeListener: (event: string, callback: CallbackFunction) => void;
};

export const injectMetaMaskStub = (WALLET_ADDRESS: string, SIGNED_MESSAGE: string, networkChainId: NetworkChainId) => {
  const eventListeners: { [event: string]: CallbackFunction[] } = {};

  const determineStubResponse = (request: EthereumRequest): string[] | string => {
    switch (request.method) {
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return [WALLET_ADDRESS];
      case 'personal_sign':
        return SIGNED_MESSAGE;
      case 'eth_chainId':
        return networkChainId;
      default:
        throw Error(`Unknown request: ${request.method}`);
    }
  };

  const networkFound: INetworkDetail = getNetworkDetailList().find(
    (network: INetworkDetail) => network.chainId === networkChainId
  );

  cy.on('window:before:load', (win: Window & typeof globalThis & { ethereum?: EthereumStub }) => {
    win.ethereum = {
      isMetaMask: true,
      eth_chainId: networkFound.chainId,
      networkVersion: networkFound.networkVersion,

      request: async (request: EthereumRequest) => determineStubResponse(request),
      on: (event, callback) => {
        if (!eventListeners[event]) {
          eventListeners[event] = [];
        }
        eventListeners[event].push(callback);
      },
      addListener: (event, callback) => {
        if (!eventListeners[event]) {
          eventListeners[event] = [];
        }
        eventListeners[event].push(callback);
      },
      removeListener: (event, callback) => {
        if (eventListeners[event]) {
          const index = eventListeners[event].indexOf(callback);
          if (index > -1) {
            eventListeners[event].splice(index, 1);
          }
        }
      }
    };
  });
};

export const getNetworkDetailList = (): INetworkDetail[] => {
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
    }
  ];
};
