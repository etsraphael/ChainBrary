import { Injectable } from '@angular/core';
import Web3 from 'web3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class NetworkServiceWeb3Login {
  web3: Web3;

  getNetworkName(networkId: string): string {
    switch (networkId) {
      case '1':
        return 'Mainnet';
      case '3':
        return 'Ropsten';
      case '4':
        return 'Rinkeby';
      case '5':
        return 'Goerli';
      case '42':
        return 'Kovan';
      case '56':
        return 'Binance Smart Chain';
      default:
        return 'Unknown';
    }
  }

  getCurrentNetwork(): { networkId: string; networkName: string } {
    if (window.ethereum && window.ethereum.isMetaMask) {
      this.web3 = new Web3(window.ethereum);
      return {
        networkId: window.ethereum.networkVersion,
        networkName: this.getNetworkName(window.ethereum.networkVersion)
      };
    }
    return {
      networkId: '0',
      networkName: 'Unknown'
    };
  }
}
