import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import Web3 from 'web3';
import { IModalState, ModalStateType } from '../../interfaces';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { NetworkServiceWeb3Login } from '../../services/network/network.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

@Component({
  selector: 'lib-web3-login',
  templateUrl: './web3-login.component.html',
  styleUrls: ['./web3-login.component.scss']
})
export class Web3LoginComponent {
  @Output() stateEvent = new EventEmitter<IModalState>();
  web3: Web3;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<Web3LoginComponent>,
    private errorHandlerService: ErrorHandlerService,
    private networkService: NetworkServiceWeb3Login,
    private deviceService: DeviceDetectorService,
    private router: Router
  ) {}

  eventHandler(state: IModalState): void {
    this.stateEvent.emit(state);
    if (state.type === ModalStateType.SUCCESS || state.type === ModalStateType.CANCEL) {
      this.dialogRef.close();
    }
  }

  openWalletProvider(providerKey: string): void {
    switch (providerKey) {
      case 'metamask':
        return this.logInWithMetamask();
    }
  }

  logInWithMetamask(): void {
    this.isLoading = true;

    // mobile app
    if (this.deviceService.isMobile() && !window?.ethereum?.isMetaMask) {
      const originLink = window.location.origin.replace(/(^\w+:|^)\/\//, '');
      const url = `https://metamask.app.link/dapp/${originLink}${this.router.url}`;
      window.open(url);
      return;
    } else if (this.deviceService.isMobile() && window?.ethereum?.isMetaMask) {
      this.requestEthAccount();
      return;
    }

    // desktop
    if (window.ethereum && window.ethereum.isMetaMask) {
      this.requestEthAccount();
    } else {
      this.isLoading = false;
      this.errorHandlerService.showSnackBar('Non-Ethereum browser detected. You should consider trying MetaMask!');
      this.stateEvent.emit({
        type: ModalStateType.ERROR,
        message: 'Non-Ethereum browser detected. You should consider trying MetaMask!'
      });
    }
  }

  requestEthAccount(): void {
    this.web3 = new Web3(window.ethereum);
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts: string[]) => {
        const chainId = window.ethereum.networkVersion;
        const payload: IModalState = {
          type: ModalStateType.SUCCESS,
          data: {
            publicAddress: accounts[0],
            network: this.networkService.getNetworkDetailByChainId(chainId)
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
  }
}
