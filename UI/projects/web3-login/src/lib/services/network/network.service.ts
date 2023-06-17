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

  getNetworkDetail(chainId: string | null): INetworkDetail {
    const networkDetailList: INetworkDetail[] = this.getNetworkDetailList();
    if (chainId) {
      const networkDetail: INetworkDetail | undefined = networkDetailList.find(
        (network: INetworkDetail) => network.chainId === chainId
      );
      if (networkDetail) {
        return networkDetail;
      }
    }
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

  getNetworkDetailList(): INetworkDetail[] {
    return [
      {
        chainId: '1',
        name: 'Ethereum',
        shortName: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      },
      {
        chainId: '56',
        name: 'Binance Smart Chain Mainnet',
        shortName: 'BNB Chain',
        nativeCurrency: {
          name: 'Binance Chain Native Token',
          symbol: 'BNB',
          decimals: 18
        }
      },
      {
        chainId: '11155111',
        name: 'Sepolia',
        shortName: 'Sepolia',
        nativeCurrency: {
          name: 'Sepolia',
          symbol: 'SEP',
          decimals: 18
        }
      },
      {
        chainId: '42161',
        name: 'Arbitrum One',
        shortName: 'Arbitrum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      },
      {
        chainId: '137',
        name: 'Polygon',
        shortName: 'Polygon',
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18
        }
      },
      {
        chainId: '10',
        name: 'Optimism',
        shortName: 'Optimism',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      },
      {
        chainId: '43114',
        name: 'Avalanche',
        shortName: 'Avalanche',
        nativeCurrency: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18
        }
      },
      {
        chainId: '1284',
        name: 'Moonbeam',
        shortName: 'Moonbeam',
        nativeCurrency: {
          name: 'Moonbeam',
          symbol: 'GLMR',
          decimals: 18
        }
      },
      {
        chainId: '222',
        name: 'KAVA',
        shortName: 'KAVA',
        nativeCurrency: {
          name: 'KAVA',
          symbol: 'KAVA',
          decimals: 18
        }
      },
      {
        chainId: '250',
        name: 'Fantom',
        shortName: 'Fantom',
        nativeCurrency: {
          name: 'Fantom',
          symbol: 'FTM',
          decimals: 18
        }
      },
      {
        chainId: '42220',
        name: 'Celo',
        shortName: 'Celo',
        nativeCurrency: {
          name: 'Celo',
          symbol: 'CELO',
          decimals: 18
        }
      }
    ];
  }

  getNetworkName(chainId: string): string {
    switch (chainId) {
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
        window.ethereum.on('chainChanged', (chainId: string) => {
          const idFormat: string = parseInt(chainId.slice(2), 16).toString();
          subscriber.next(this.getNetworkDetail(idFormat));
        });
      });
    });
  }
}
