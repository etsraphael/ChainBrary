import '@angular/compiler';
import { INetworkDetail, NetworkChainCode, NetworkChainId, TokenId } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { TransactionBridgeContract } from '../../src/app/shared/contracts';

type EthereumRequest = {
  method: string;
  params: any[];
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

  const web3: Web3 = new Web3('http://localhost:8545');

  const determineStubResponse = async (request: EthereumRequest): Promise<string[] | string | object | number> => {
    switch (request.method) {
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return await web3.eth.getAccounts();
      case 'personal_sign':
        return SIGNED_MESSAGE;
      case 'eth_chainId':
        return await web3.eth.getChainId();
      case 'eth_gasPrice':
        return await web3.eth.getGasPrice();
      case 'eth_estimateGas': {
        return await web3.eth.estimateGas({
          from: request.params[0].from,
          to: request.params[0].to,
          value: request.params[0].value
        });
      }
      case 'eth_getBlockByNumber':
        return await web3.eth.getBlock(request.params[0]);
      case 'eth_sendTransaction': {
        const transactionContract = new TransactionBridgeContract(NetworkChainId.LOCALHOST);
        const contract: Contract = new web3.eth.Contract(
          transactionContract.getAbi(),
          transactionContract.getAddress()
        );
        const nonce = await web3.eth.getTransactionCount(request.params[0].from, 'pending');

        const tx: TransactionConfig = {
          from: request.params[0].from,
          to: transactionContract.getAddress(),
          value: web3.utils.toWei('1', 'ether'),
          gas: 2000000,
          data: contract.methods.transferFund(['0xd288b9f2028cea98f3132b700fa45c95023eca24']).encodeABI(), //TODO: add real value here
          nonce: nonce + 1
        };

        return web3.eth.accounts
          .signTransaction(tx, '0x958c7263fbecaafea7c1d81ff08482ef57655dc4f350890dbc3d7ef5784330dd') //TODO: add real value here
          .then((signedTx) => web3.eth.sendSignedTransaction(signedTx.rawTransaction));
      }
      case 'eth_getTransactionReceipt': {
        return web3.eth.getTransactionReceipt(request.params[0].transactionHash);
      }
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
      chainId: networkFound.chainCode,
      networkVersion: networkFound.chainId,

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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
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
      rpcUrls: []
    },
    {
      chainId: NetworkChainId.LOCALHOST,
      chainCode: NetworkChainCode.LOCALHOST,
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
    }
  ];
};
