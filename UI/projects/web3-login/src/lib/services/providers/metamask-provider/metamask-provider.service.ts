import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EMPTY, Observable, defer, of } from 'rxjs';
import { INetworkDetail, WalletProvider } from '../../../interfaces';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { PrivateGlobalValuesService } from '../../global-values/private-global-values.service';
import { PublicGlobalValuesService } from '../../global-values/public-global-values.service';
import { NetworkServiceWeb3Login } from '../../network/network.service';
import { BaseProviderService } from '../base-provider/base-provider.service';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskProviderService extends BaseProviderService {
  constructor(
    protected override errorHandlerService: ErrorHandlerService,
    protected override networkService: NetworkServiceWeb3Login,
    protected override deviceService: DeviceDetectorService,
    protected override router: Router,
    protected override privateGlobalValuesService: PrivateGlobalValuesService,
    protected override publicGlobalValuesService: PublicGlobalValuesService
  ) {
    super(
      errorHandlerService,
      networkService,
      deviceService,
      router,
      privateGlobalValuesService,
      publicGlobalValuesService
    );
  }

  logInWithWallet(): void {
    this.privateGlobalValuesService.isLoading = true;

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
      this.privateGlobalValuesService.isLoading = false;
      this.errorHandlerService.showSnackBar('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
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

  onChainChangedEvent(): Observable<INetworkDetail | null> {
    return defer(() => {
      if (typeof window?.ethereum === 'undefined') return of(null);
      return new Observable<INetworkDetail>((subscriber) => {
        window.ethereum.on('chainChanged', (chainId: string) => {
          subscriber.next(this.networkService.getNetworkDetailByChainId(chainId));
          this.publicGlobalValuesService.currentNetwork = this.networkService.getNetworkDetailByChainId(chainId);
        });
      });
    });
  }

  retreiveWalletProvider(): void {
    if (typeof window?.ethereum === 'undefined') {
      this.publicGlobalValuesService.walletConnected = null;
      return;
    }

    // send event to onWalletConnectedEvent$ if the user is already connected
    if (window.ethereum.isMetaMask) {
      setTimeout(() => {
        // Stop if no account is connected
        if (window.ethereum._state?.accounts?.length === 0) {
          return;
        }

        // Request account access
        window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
          // Request chainId
          window.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
            this.publicGlobalValuesService.currentNetwork = this.networkService.getNetworkDetailByChainId(chainId);
            this.publicGlobalValuesService.walletConnected = WalletProvider.METAMASK;
            this.publicGlobalValuesService.recentLoginPayload = {
              publicAddress: accounts[0],
              network: chainId
            };
          });
        });
      }, 1000);
      return;
    }
  }

  private requestEthAccount(): void {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts: string[]) => {
        this.publicGlobalValuesService.walletConnected = WalletProvider.METAMASK;
        this.publicGlobalValuesService.recentLoginPayload = {
          publicAddress: accounts[0],
          network: window.ethereum.eth_chainId
        };
      })
      .catch((error: Error) => {
        this.errorHandlerService.showSnackBar(error.message);
      })
      .finally(() => {
        this.privateGlobalValuesService.isLoading = false;
      });
  }
}
