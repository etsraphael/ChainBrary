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
    txnHash: '0x2b97bb35f81681716958aca7a3fe19a5d94b4707c26209f73de97a7add0b555e',
    name: 'LocalHost network',
    chainId: NetworkChainId.LOCALHOST,
    rpcUrl: 'http://127.0.0.1:8545'
  }
];
