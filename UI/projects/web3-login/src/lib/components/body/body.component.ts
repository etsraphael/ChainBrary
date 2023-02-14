import { Component, EventEmitter, Output } from '@angular/core';
import Web3 from 'web3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

@Component({
  selector: 'lib-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  @Output() closeDialogEvent = new EventEmitter();

  web3: Web3;
  isLoading = false;
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
    }
  ];

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
        this.closeDialogEvent.emit();
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
