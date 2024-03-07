import { NetworkChainId } from '@chainbrary/web3-login';
import { VaultSupported } from '../shared/interfaces';

export const communityVaults: VaultSupported[] = [
  // {
  //   txnHash: '0x052f58543deb1d20d34dd63ff5d8a2bcf4b93af7228ec66e7bfb9c77f61332b5',
  //   name: 'Sepolia network',
  //   chainId: NetworkChainId.SEPOLIA,
  //   rpcUrl: '' // TODO: replace with actual RPC URL
  // },
  {
    txnHash: '0xda0e662d93e9ac09940544302737aa254d9c9adcc091de5ecdcd8fb0a735541a',
    name: 'LocalHost network',
    chainId: NetworkChainId.LOCALHOST,
    rpcUrl: 'http://127.0.0.1:8545'
  }
];
