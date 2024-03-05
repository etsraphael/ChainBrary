import { NetworkChainId } from '@chainbrary/web3-login';
import { VaultSupported } from '../shared/interfaces';

export const communityVaults: VaultSupported[] = [
  {
    contractAddress: '0x6f1F1e0b86143964D4E78abD68867e045314187A',
    name: 'Sepolia network',
    chainId: NetworkChainId.SEPOLIA,
    rpcUrl: '**' // TODO: replace with actual RPC URL
  }
];
