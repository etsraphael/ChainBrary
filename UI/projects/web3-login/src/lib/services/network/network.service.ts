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
      chainCode: 'unknown',
      name: 'Unknown',
      shortName: 'unknown',
      nativeCurrency: {
        name: 'Unknown',
        symbol: 'UNK',
        decimals: 18
      }
    };
  }

  getNetworkDetailByChainCode(chainCode: string): INetworkDetail {
    const networkDetailList: INetworkDetail[] = this.getNetworkDetailList();
    const networkDetail: INetworkDetail | undefined = networkDetailList.find(
      (network: INetworkDetail) => network.chainCode === chainCode
    );
    if (networkDetail) {
      return networkDetail;
    }
    return {
      chainId: '0',
      chainCode: 'unknown',
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
        chainCode: '0x1',
        name: 'Ethereum Mainnet',
        shortName: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      },
      {
        chainId: '56',
        chainCode: '0x38',
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
        chainCode: '0xaa36a7',
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
        chainCode: '0xa4b1',
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
        chainCode: '0x89',
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
        chainCode: '0xa',
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
        chainCode: '0xa86a',
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
        chainCode: '0x504',
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
        chainCode: '0x8ae',
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
        chainCode: '0xfa',
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
        chainCode: '0xa4ec',
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
      console.log('window.ethereum.networkVersion', window.ethereum.networkVersion);
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
        window.ethereum.on('chainChanged', (chainCode: string) =>
          subscriber.next(this.getNetworkDetailByChainCode(chainCode))
        );
      });
    });
  }
}
