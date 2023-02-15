import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Web3 from 'web3';
import { ModalState, ModalStateType } from '../../interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

@Component({
  selector: 'lib-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  @Output() stateEvent = new EventEmitter<ModalState>();

  constructor(
    private _snackBar: MatSnackBar
  ) {}

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
    }
  }

  logInWithMetamask(): void {
    this.isLoading = true;
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
        this.stateEvent.emit({ type: ModalStateType.SUCCESS, data: { publicAddress: accounts[0] } });
      }).catch((error: Error) => {
        this._snackBar.open(
          error.message,
          'Close',
          {
            duration: 5000,
          });
        this.stateEvent.emit({ type: ModalStateType.ERROR, message: error.message });
      }).finally(() => {
        this.isLoading = false;
      });
    } else {
      this._snackBar.open(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
        'Close',
        {
          duration: 5000,
        });
      this.isLoading = false;
      this.stateEvent.emit({ type: ModalStateType.ERROR, message: 'Non-Ethereum browser detected. You should consider trying MetaMask!' });
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
