import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, filter, map } from 'rxjs';
import { LoginPayload, WalletConnectedEvent, WalletProvider } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PublicGlobalValuesService {
  private _walletConnected: BehaviorSubject<WalletProvider | null> = new BehaviorSubject<WalletProvider | null>(null);
  private _loginPayload: BehaviorSubject<LoginPayload | null> = new BehaviorSubject<LoginPayload | null>(null);


  // global values

  set walletConnected(value: WalletProvider | null) {
    this._walletConnected.next(value);
  }

  get walletConnected$(): Observable<WalletProvider | null> {
    return this._walletConnected.asObservable();
  }

  set recentLoginPayload(value: LoginPayload | null) {
    this._loginPayload.next(value);
  }

  get recentLoginPayload$(): Observable<LoginPayload | null> {
    return this._loginPayload.asObservable();
  }

  // events from providers

  get onWalletConnectedEvent$(): Observable<WalletConnectedEvent> {
    return combineLatest([
      this.walletConnected$,
      this.recentLoginPayload$
    ]).pipe(
      filter(([walletProvider, loginPayload]: [WalletProvider | null, LoginPayload | null]) => !!walletProvider && !!loginPayload),
      distinctUntilChanged(),
      map(([walletProvider, loginPayload]: [WalletProvider| null, LoginPayload| null]) => {
        return {
          walletProvider,
          ...loginPayload
        }
      })
    ) as Observable<WalletConnectedEvent>;
  }

}
