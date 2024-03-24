import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail, Web3LoginComponent, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthStatusCode, CommonButtonText } from '../../enum';
import { IProfileAdded } from '../../interfaces';
import { FormatService } from '../../services/format/format.service';
import { environment } from './../../../../environments/environment';
import { networkChange, resetAuth } from './../../../store/auth-store/state/actions';
import {
  selectAccount,
  selectAuthStatus,
  selectNetworkName,
  selectPublicAddress
} from './../../../store/auth-store/state/selectors';

@Component({
  selector: 'app-auth-banner',
  templateUrl: './auth-banner.component.html',
  styleUrls: ['./auth-banner.component.scss']
})
export class AuthBannerComponent implements OnInit, OnDestroy {
  @Input() networkFrozen = false;
  authStatusCodeTypes = AuthStatusCode;
  networkList: INetworkDetail[] = [];
  modalSub: Subscription;
  commonButtonText = CommonButtonText;

  constructor(
    private store: Store,
    public formatService: FormatService,
    private web3LoginService: Web3LoginService
  ) {}

  authStatus$: Observable<AuthStatusCode> = this.store.select(selectAuthStatus);
  publicAddress$: Observable<string | null> = this.store.select(selectPublicAddress);
  networkName$: Observable<string | null> = this.store.select(selectNetworkName);
  verifiedAccount$: Observable<IProfileAdded | null> = this.store.select(selectAccount);

  ngOnInit(): void {
    this.networkSetUp();
  }

  networkSetUp(): void {
    this.networkList = this.web3LoginService
      .getNetworkDetailList()
      .filter(({ chainId }: INetworkDetail) => environment.contracts.bridgeTransfer.networkSupported.includes(chainId));
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  openLoginModal(): MatDialogRef<Web3LoginComponent> {
    return this.web3LoginService.openLoginModal();
  }

  logOut(): void {
    return this.store.dispatch(resetAuth());
  }

  changeNetwork(network: INetworkDetail): void {
    return this.store.dispatch(networkChange({ network }));
  }
}
