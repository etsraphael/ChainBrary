import { Injectable } from '@angular/core';
import { WalletProvider } from '@chainbrary/web3-login';
import Web3 from 'web3';

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
}
