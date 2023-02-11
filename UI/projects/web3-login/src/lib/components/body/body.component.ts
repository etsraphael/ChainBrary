import { Component } from '@angular/core';
import Web3 from 'web3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

@Component({
  selector: 'lib-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  web3: Web3;

  providers: Web3Provider[] = [
    {
      key: 'metamask',
      name: 'Metamask',
      iconUrl: './../assets/metamask.svg',
      backgroundColorGradient: {
        start: '#B16000',
        end: '#DF7900',
        orientation: {
          start: [0, 0],
          end: [0, 1]
        }
      }
    },
    {
      key: 'ledger',
      name: 'Ledger',
      iconUrl: './../assets/ledger.svg',
      backgroundColorGradient: {
        start: '#1B1713',
        end: '#303030',
        orientation: {
          start: [0, 0],
          end: [0, 1]
        }
      }
    }
  ];

  isLoading = false;

  getGradientStyle(provider: Web3Provider): string {
    return `linear-gradient(${provider.backgroundColorGradient.orientation.start[0]}deg, ${provider.backgroundColorGradient.start}, ${provider.backgroundColorGradient.end})`;
  }

  openWalletProvider(providerKey: string): void {
    switch (providerKey) {
      case 'metamask':
        return this.logInWithMetamask();
      case 'ledger':
      default:
        break;
    }
  }

  logInWithMetamask(): void {
    this.isLoading = true;

    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
        this.isLoading = false;
      });
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      this.isLoading = false;
    }
  }
}

interface Web3Provider {
  key: string;
  name: string;
  iconUrl: string;
  backgroundColorGradient: {
    start: string;
    end: string;
    orientation: {
      start: [number, number];
      end: [number, number];
    };
  };
}
