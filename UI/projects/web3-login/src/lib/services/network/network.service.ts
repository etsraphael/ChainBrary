import { Injectable } from '@angular/core';
import { EMPTY, Observable, defer, of } from 'rxjs';
import Web3 from 'web3';
import { INetworkDetail } from '../../interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class NetworkServiceWeb3Login {
  web3: Web3;

  getNetworkDetail(networkId: string | null): INetworkDetail {
    switch (networkId) {
      case '1':
        return {
          chainId: '1',
          name: 'Ethereum',
          shortName: 'eth',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          }
        };
      case '56':
        return {
          chainId: '56',
          name: 'Binance Smart Chain Mainnet',
          shortName: 'BNB Chain',
          nativeCurrency: {
            name: 'Binance Chain Native Token',
            symbol: 'BNB',
            decimals: 18
          }
        };
      case '11155111':
        return {
          chainId: '11155111',
          name: 'Sepolia',
          shortName: 'Sepolia',
          nativeCurrency: {
            name: 'Sepolia',
            symbol: 'SEP',
            decimals: 18
          }
        };
      default:
        return {
          chainId: '0',
          name: 'Unknown',
          shortName: 'unknown',
          nativeCurrency: {
            name: 'Unknown',
            symbol: 'UNK',
            decimals: 18
          }
        };
    }
  }

  getNetworkName(networkId: string): string {
    switch (networkId) {
      case '1':
        return 'Mainnet';
      case '56':
        return 'Binance Smart Chain';
      case '11155111':
        return 'Sepolia';
      default:
        return 'Unknown';
    }
  }

  getCurrentNetwork(): INetworkDetail {
    if (window.ethereum && window.ethereum.isMetaMask) {
      this.web3 = new Web3(window.ethereum);
      return this.getNetworkDetail(window.ethereum.networkVersion);
    }
    return this.getNetworkDetail(null);
  }

  onAccountChangedEvent(): Observable<string | undefined> {
    return defer(() => {
      if (typeof window?.ethereum === 'undefined') {
        return EMPTY as Observable<string | undefined>;
      }

      return new Observable<string>((subscriber) => {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            subscriber.next(undefined);
          } else {
            subscriber.next(accounts[0]);
          }
        });
      });
    });
  }

  onChainChangedEvent(): Observable<INetworkDetail> {
    return defer(() => {
      if (typeof window?.ethereum === 'undefined') {
        return of(this.getCurrentNetwork());
      }

      return new Observable<INetworkDetail>((subscriber) => {
        window.ethereum.on('chainChanged', (networkId: string) => {
          const idFormat: string = parseInt(networkId.slice(2), 16).toString();
          subscriber.next(this.getNetworkDetail(idFormat));
        });
      });
    });
  }
}
