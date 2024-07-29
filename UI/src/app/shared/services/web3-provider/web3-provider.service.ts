import { Injectable, isDevMode } from '@angular/core';
import { NetworkChainId, WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Web3ProviderService {
  getWeb3Provider(w: WalletProvider): Web3 | null {
    switch (w) {
      case WalletProvider.METAMASK:
      case WalletProvider.BRAVE_WALLET:
        return new Web3(window.ethereum);
      default:
        return null;
    }
  }

  getRpcUrl(chainId: NetworkChainId, forceNode: boolean): string {
    // If it's dev mode, use the localhost rpc
    if (isDevMode() && forceNode === false) {
      return environment.rpcKeys.local;
    }

    switch (chainId) {
      case NetworkChainId.ETHEREUM:
        return environment.rpcKeys.eth;
      case NetworkChainId.BNB:
        return environment.rpcKeys.bnb;
      case NetworkChainId.AVALANCHE:
        return environment.rpcKeys.avalanche;
      case NetworkChainId.POLYGON:
        return environment.rpcKeys.polygon;
      case NetworkChainId.SEPOLIA:
        return environment.rpcKeys.sepolia;
      default:
        return environment.rpcKeys.local;
    }
  }
}
