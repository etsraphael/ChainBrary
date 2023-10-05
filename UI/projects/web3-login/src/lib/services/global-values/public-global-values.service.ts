import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, filter, map } from 'rxjs';
import { INetworkDetail, LoginPayload, WalletConnectedEvent, WalletProvider } from '../../interfaces';
import { NetworkServiceWeb3Login } from '../network/network.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGlobalValuesService {
  private _walletConnected: BehaviorSubject<WalletProvider | null> = new BehaviorSubject<WalletProvider | null>(null);
  private _loginPayload: BehaviorSubject<LoginPayload | null> = new BehaviorSubject<LoginPayload | null>(null);
  private _currentNetwork: BehaviorSubject<INetworkDetail | null> = new BehaviorSubject<INetworkDetail | null>(null);

  readonly walletConnected$: Observable<WalletProvider | null> = this._walletConnected.asObservable();
  readonly recentLoginPayload$: Observable<LoginPayload | null> = this._loginPayload.asObservable();
  readonly currentNetwork$: Observable<INetworkDetail | null> = this._currentNetwork.asObservable();

  constructor(private networkServiceWeb3Login: NetworkServiceWeb3Login) {}

  // global values

  set walletConnected(value: WalletProvider | null) {
    this._walletConnected.next(value);
  }

  set recentLoginPayload(value: LoginPayload | null) {
    this._loginPayload.next(value);
  }

  set currentNetwork(value: INetworkDetail | null) {
    this._currentNetwork.next(value);
  }

  // events from providers

  get onWalletConnectedEvent$(): Observable<WalletConnectedEvent> {
    return combineLatest([this.walletConnected$, this.recentLoginPayload$]).pipe(
      filter(
        ([walletProvider, loginPayload]: [WalletProvider | null, LoginPayload | null]) =>
          !!walletProvider && !!loginPayload
      ),
      distinctUntilChanged(),
      map(([walletProvider, loginPayload]: [WalletProvider | null, LoginPayload | null]) => {
        return {
          walletProvider,
          publicAddress: loginPayload?.publicAddress,
          network: this.networkServiceWeb3Login.getNetworkDetailByChainId(loginPayload?.network as string)
        };
      })
    ) as Observable<WalletConnectedEvent>;
  }
}
