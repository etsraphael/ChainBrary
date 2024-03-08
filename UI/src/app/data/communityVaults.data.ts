import { NetworkChainId } from '@chainbrary/web3-login';
import { VaultSupported } from '../shared/interfaces';
import { environment } from './../../environments/environment';

export const communityVaults: VaultSupported[] = [
  {
    txnHash: '0x2e671924b88a6ef7c474b34d97f820d9c97f17e670865b8351fb785cb0eed78a',
    name: 'Sepolia network',
    chainId: NetworkChainId.SEPOLIA,
    rpcUrl: environment.rpcKeys.sepolia
  },
  {
    txnHash: '0xce5777e63cc96b0be6facb4f1fc7cea9a9016dda9dc3cfff97a8cf9042df6629',
    name: 'Polygon network',
    chainId: NetworkChainId.POLYGON,
    rpcUrl: environment.rpcKeys.polygon
  },
  {
    txnHash: '0xda0e662d93e9ac09940544302737aa254d9c9adcc091de5ecdcd8fb0a735541a',
    name: 'LocalHost network',
    chainId: NetworkChainId.LOCALHOST,
    rpcUrl: 'http://127.0.0.1:8545'
  }
];
