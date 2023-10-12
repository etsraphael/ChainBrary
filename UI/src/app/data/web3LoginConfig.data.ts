import { NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';

export const web3LoginConfig: Web3LoginConfig = {
  networkSupported: [
    {
      chainId: NetworkChainId.ETHEREUM,
      rpcUrl: ['https://ethereum.publicnode.com']
    },
    {
      chainId: NetworkChainId.SEPOLIA,
      rpcUrl: ['https://rpc.sepolia.org']
    },
    {
      chainId: NetworkChainId.POLYGON,
      rpcUrl: ['https://polygon-rpc.com']
    },
    {
      chainId: NetworkChainId.BNB,
      rpcUrl: ['https://bsc-dataseed.binance.org']
    },
    {
      chainId: NetworkChainId.AVALANCHE,
      rpcUrl: ['https://api.avax.network/ext/bc/C/rpc']
    },
    {
      chainId: NetworkChainId.LOCALHOST,
      rpcUrl: ['http://localhost:8545']
    }
  ]
};
