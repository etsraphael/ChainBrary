import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Web3LoginComponent } from '../../containers/web3-login/web3-login.component';
import { IModalState, INetworkDetail } from '../../interfaces';
import { NetworkServiceWeb3Login } from '../network/network.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3LoginService {
  constructor(public dialog: MatDialog, private networkServiceWeb3Login: NetworkServiceWeb3Login) {}

  get onAccountChangedEvent$(): Observable<string | undefined> {
    return this.networkServiceWeb3Login.onAccountChangedEvent();
  }

  get onChainChangedEvent$(): Observable<INetworkDetail> {
    return this.networkServiceWeb3Login.onChainChangedEvent();
  }

  openLoginModal(): EventEmitter<IModalState> {
    const dialogRef: MatDialogRef<Web3LoginComponent> = this.dialog.open(Web3LoginComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4'],
      position: { top: '5%' }
    });

    return dialogRef.componentInstance.stateEvent;
  }

  closeLoginModal(): void {
    return this.dialog.closeAll();
  }

  getNetworkName(networkId: string): string {
    return this.networkServiceWeb3Login.getNetworkName(networkId);
  }

  getNetworkDetail(networkId: string | null): INetworkDetail {
    return this.networkServiceWeb3Login.getNetworkDetail(networkId);
  }

  getCurrentNetwork(): INetworkDetail {
    return this.networkServiceWeb3Login.getCurrentNetwork();
  }
}
