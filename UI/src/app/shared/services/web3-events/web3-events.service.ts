import { Injectable } from '@angular/core';
import {
  INetworkDetail,
  WalletConnectedEvent,
  WalletErrorEvent,
  WalletProvider,
  Web3LoginService
} from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { filter, map, skip } from 'rxjs';
import {
  accountChanged,
  networkChangeSuccess,
  setAuthPublicAddress,
  walletError
} from './../../../store/auth-store/state/actions';

@Injectable({
  providedIn: 'root'
})
export class Web3EventsService {
  constructor(
    private web3LoginService: Web3LoginService,
    private store: Store
  ) {}

  init(): void {
    this.web3LoginService.onAccountChangedEvent$.pipe(skip(1)).subscribe((account: string | undefined) => {
      this.store.dispatch(accountChanged({ publicAddress: account ? account : null }));
    });

    this.web3LoginService.onWalletConnectedEvent$.subscribe((wallet: WalletConnectedEvent) => {
      this.store.dispatch(
        setAuthPublicAddress({
          publicAddress: wallet.publicAddress as string,
          network: wallet.network as INetworkDetail,
          wallet: wallet.walletProvider as WalletProvider
        })
      );
    });

    this.web3LoginService.onChainChangedEvent$
      .pipe(
        filter((network: INetworkDetail | null) => !!network),
        map((network: INetworkDetail | null) => network as INetworkDetail)
      )
      .subscribe((network: INetworkDetail) => {
        this.store.dispatch(networkChangeSuccess({ network }));
      });

    this.web3LoginService.walletError$
      .pipe(
        filter((error: WalletErrorEvent | null) => !!error),
        map((error: WalletErrorEvent | null) => error as WalletErrorEvent)
      )
      .subscribe((error: WalletErrorEvent) =>
        this.store.dispatch(walletError({ code: error.code, message: error.message }))
      );
  }
}
