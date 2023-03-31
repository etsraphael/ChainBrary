import { Component, EventEmitter, Output } from '@angular/core';
import Web3 from 'web3';
import { ModalState, ModalStateType, providerData, Web3Provider } from '../../interfaces';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { NetworkServiceWeb3Login } from '../../services/network/network.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

@Component({
  selector: 'lib-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  @Output() stateEvent = new EventEmitter<ModalState>();
  web3: Web3;
  isLoading = false;
  providers = providerData;

  constructor(private errorHandlerService: ErrorHandlerService, private networkService: NetworkServiceWeb3Login) {}

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
    if (window.ethereum && window.ethereum.isMetaMask) {
      this.web3 = new Web3(window.ethereum);
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          const networkId = window.ethereum.networkVersion;
          const payload: ModalState = {
            type: ModalStateType.SUCCESS,
            data: {
              publicAddress: accounts[0],
              networkId: networkId,
              networkName: this.networkService.getNetworkName(networkId)
            }
          };
          this.stateEvent.emit(payload);
        })
        .catch((error: Error) => {
          this.errorHandlerService.showSnackBar(error.message);
          this.stateEvent.emit({ type: ModalStateType.ERROR, message: error.message });
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
      this.errorHandlerService.showSnackBar('Non-Ethereum browser detected. You should consider trying MetaMask!');
      this.stateEvent.emit({
        type: ModalStateType.ERROR,
        message: 'Non-Ethereum browser detected. You should consider trying MetaMask!'
      });
    }
  }
}
