import { Injectable } from '@angular/core';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { accountChanged, networkChangeSuccess } from './../../../store/auth-store/state/actions';
import { filter, map } from 'rxjs';

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
