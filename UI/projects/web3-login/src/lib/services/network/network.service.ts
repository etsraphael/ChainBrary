import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  onAccountChangedEvent(): Observable<string | undefined> {
    return new Observable<string>((subscriber) => {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          subscriber.next(undefined);
        } else {
          subscriber.next(accounts[0]);
        }
      });
    });
  }

  onChainChangedEvent(): Observable<{ networkId: string; networkName: string }> {
    return new Observable<{ networkId: string; networkName: string }>((subscriber) => {
      window.ethereum.on('chainChanged', (networkId: string) => {
        const idFormat: string = parseInt(networkId.slice(2), 16).toString();
        subscriber.next({
          networkId: idFormat,
          networkName: this.getNetworkName(idFormat)
        });
      });
    });
  }
}
