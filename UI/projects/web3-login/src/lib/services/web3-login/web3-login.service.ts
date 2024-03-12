import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, distinctUntilChanged, of, switchMap } from 'rxjs';
import { Web3LoginComponent } from '../../containers/web3-login/web3-login.component';
import { INetworkDetail, WalletConnectedEvent, WalletProvider } from '../../interfaces';
import { PublicGlobalValuesService } from '../global-values/public-global-values.service';
import { NetworkServiceWeb3Login } from '../network/network.service';
import { BraveWalletProviderService } from '../providers/brave-wallet-provider/brave-wallet-provider.service';
import { MetamaskProviderService } from '../providers/metamask-provider/metamask-provider.service';

@Injectable({
  providedIn: 'root'
})
export class Web3LoginService {
  constructor(
    private dialog: MatDialog,
    private networkServiceWeb3Login: NetworkServiceWeb3Login,
    private publicGlobalValuesService: PublicGlobalValuesService,
    private metamaskProviderService: MetamaskProviderService,
    private braveWalletProviderService: BraveWalletProviderService
  ) {}

  get onAccountChangedEvent$(): Observable<string | undefined> {
    return this.publicGlobalValuesService.walletConnected$.pipe(
      distinctUntilChanged(),
      switchMap((walletProvider: WalletProvider | null) => {
        switch (walletProvider) {
          case WalletProvider.METAMASK:
            return this.metamaskProviderService.onAccountChangedEvent();
          case WalletProvider.BRAVE_WALLET:
            return this.braveWalletProviderService.onAccountChangedEvent();
          default:
            return of(undefined);
        }
      })
    );
  }

  get onWalletConnectedEvent$(): Observable<WalletConnectedEvent> {
    return this.publicGlobalValuesService.onWalletConnectedEvent$;
  }

  get onChainChangedEvent$(): Observable<INetworkDetail | null> {
    return this.publicGlobalValuesService.walletConnected$.pipe(
      distinctUntilChanged(),
      switchMap((walletProvider: WalletProvider | null) => {
        switch (walletProvider) {
          case WalletProvider.METAMASK:
            return this.metamaskProviderService.onChainChangedEvent();
          case WalletProvider.BRAVE_WALLET:
            return this.braveWalletProviderService.onChainChangedEvent();
          default:
            return of(null);
        }
      })
    );
  }

  get currentNetwork$(): Observable<INetworkDetail | null> {
    return this.publicGlobalValuesService.currentNetwork$;
  }

  openLoginModal(): MatDialogRef<Web3LoginComponent> {
    return this.dialog.open(Web3LoginComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4'],
      position: { top: '5%' }
    });
  }

  closeLoginModal(): void {
    return this.dialog.closeAll();
  }

  getNetworkDetailByChainId(chainId: string | null): INetworkDetail {
    return this.networkServiceWeb3Login.getNetworkDetailByChainId(chainId);
  }

  getNetworkDetailList(): INetworkDetail[] {
    return this.networkServiceWeb3Login.getNetworkDetailList();
  }

  retreiveWalletProvider(wallet: WalletProvider): void {
    switch (wallet) {
      case WalletProvider.METAMASK:
        return this.metamaskProviderService.retreiveWalletProvider();
      case WalletProvider.BRAVE_WALLET:
        return this.braveWalletProviderService.retreiveWalletProvider();
      default:
        return;
    }
  }

  getCurrentBalance(wallet: WalletProvider): Observable<number> {
    switch (wallet) {
      case WalletProvider.METAMASK:
        return this.metamaskProviderService.getCurrentBalance();
      case WalletProvider.BRAVE_WALLET:
        return this.braveWalletProviderService.getCurrentBalance();
    }
  }
}
