import { NetworkChainId } from '@chainbrary/web3-login';
import { VaultSupported } from '../shared/interfaces';

export const communityVaults: VaultSupported[] = [
  // {
  //   txnHash: '0x6f1F1e0b86143964D4E78abD68867e045314187A',
  //   name: 'Sepolia network',
  //   chainId: NetworkChainId.SEPOLIA,
  //   rpcUrl: '**' // TODO: replace with actual RPC URL
  // },
  {
    txnHash: '0x292fac4a2b7148610e24fab7ef81416590c517da0cda62407b5958b9a5ae12bc',
    name: 'LocalHost network',
    chainId: NetworkChainId.LOCALHOST,
    rpcUrl: 'http://127.0.0.1:8545'
  }
];
