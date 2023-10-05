import { Injectable } from '@angular/core';
import { INetworkDetail, WalletConnectedEvent, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { accountChanged, networkChangeSuccess, setAuthPublicAddress } from './../../../store/auth-store/state/actions';
import { filter, map, skip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3EventsService {
  constructor(
    private web3LoginService: Web3LoginService,
    private store: Store
  ) {}

  init(): void {
    // TODO: Find a way to trigger this even when the user is already connected
    this.web3LoginService.onAccountChangedEvent$.pipe(skip(1)).subscribe((account: string | undefined) => {
      this.store.dispatch(accountChanged({ publicAddress: account ? account : null }));
    });

    this.web3LoginService.onWalletConnectedEvent$.subscribe((walletProvider: WalletConnectedEvent) => {
      this.store.dispatch(
        setAuthPublicAddress({
          publicAddress: walletProvider.publicAddress as string,
          network: walletProvider.network as INetworkDetail
        })
      );
      this.web3LoginService.closeLoginModal();
    });

    this.web3LoginService.onChainChangedEvent$
      .pipe(
        filter((network: INetworkDetail | null) => !!network),
        map((network: INetworkDetail | null) => network as INetworkDetail)
      )
      .subscribe((network: INetworkDetail) => {
        this.store.dispatch(networkChangeSuccess({ network }));
      });
  }
}
