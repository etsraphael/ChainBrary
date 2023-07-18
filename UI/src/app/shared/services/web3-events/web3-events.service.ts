import { Injectable } from '@angular/core';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { accountChanged, networkChangeSuccess } from './../../../store/auth-store/state/actions';

@Injectable({
  providedIn: 'root'
})
export class Web3EventsService {
  constructor(
    private web3LoginService: Web3LoginService,
    private store: Store
  ) {}

  init(): void {
    this.web3LoginService.onAccountChangedEvent$.subscribe((account: string | undefined) => {
      this.store.dispatch(accountChanged({ publicAddress: account ? account : null }));
    });

    this.web3LoginService.onChainChangedEvent$.subscribe((network: INetworkDetail) => {
      this.store.dispatch(networkChangeSuccess({ network }));
    });
  }
}
