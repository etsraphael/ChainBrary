import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { WalletProvider } from '../../interfaces';
import { PrivateGlobalValuesService } from '../../services/global-values/private-global-values.service';
import { MetamaskProviderService } from '../../services/providers/metamask-provider/metamask-provider.service';

@Component({
  selector: 'lib-web3-login',
  templateUrl: './web3-login.component.html',
  styleUrls: ['./web3-login.component.scss']
})
export class Web3LoginComponent implements OnInit, OnDestroy {
  // @Output() stateEvent = new EventEmitter<IModalState>();
  isLoading$: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<Web3LoginComponent>,
    private metamaskProviderService: MetamaskProviderService,
    private privateGlobalValuesService: PrivateGlobalValuesService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.privateGlobalValuesService.isLoading$;
  }

  ngOnDestroy(): void {
    this.privateGlobalValuesService.isLoading = false;
  }

  openWalletProvider(providerKey: WalletProvider): void {
    switch (providerKey) {
      case WalletProvider.METAMASK:
        return this.metamaskProviderService.logInWithWallet();
    }
  }

  // eventHandler(state: IModalState): void {
  //   this.stateEvent.emit(state);
  //   if (state.type === ModalStateType.SUCCESS || state.type === ModalStateType.CANCEL) {
  //     this.dialogRef.close();
  //   }
  // }



  // logInWithMetamask(): void {
  //   this.isLoading = true;

  //   // mobile app
  //   if (this.deviceService.isMobile() && !window?.ethereum?.isMetaMask) {
  //     const originLink = window.location.origin.replace(/(^\w+:|^)\/\//, '');
  //     const url = `https://metamask.app.link/dapp/${originLink}${this.router.url}`;
  //     window.open(url);
  //     return;
  //   } else if (this.deviceService.isMobile() && window?.ethereum?.isMetaMask) {
  //     this.requestEthAccount();
  //     return;
  //   }

  //   // desktop
  //   if (window.ethereum && window.ethereum.isMetaMask) {
  //     this.requestEthAccount();
  //   } else {
  //     this.isLoading = false;
  //     this.errorHandlerService.showSnackBar('Non-Ethereum browser detected. You should consider trying MetaMask!');
  //     this.stateEvent.emit({
  //       type: ModalStateType.ERROR,
  //       message: 'Non-Ethereum browser detected. You should consider trying MetaMask!'
  //     });
  //   }
  // }

  // requestEthAccount(): void {
  //   this.web3 = new Web3(window.ethereum);
  //   window.ethereum
  //     .request({ method: 'eth_requestAccounts' })
  //     .then((accounts: string[]) => {
  //       const chainId = window.ethereum.networkVersion;
  //       const payload: IModalState = {
  //         type: ModalStateType.SUCCESS,
  //         data: {
  //           publicAddress: accounts[0],
  //           network: this.networkService.getNetworkDetailByChainId(chainId)
  //         }
  //       };
  //       this.stateEvent.emit(payload);
  //     })
  //     .catch((error: Error) => {
  //       this.errorHandlerService.showSnackBar(error.message);
  //       this.stateEvent.emit({ type: ModalStateType.ERROR, message: error.message });
  //     })
  //     .finally(() => {
  //       this.isLoading = false;
  //     });
  // }
}
