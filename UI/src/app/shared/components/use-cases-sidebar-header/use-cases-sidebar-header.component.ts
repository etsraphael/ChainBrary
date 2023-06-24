import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IModalState, INetworkDetail, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthStatusCode } from '../../enum';
import { IProfileAdded } from '../../interfaces';
import { FormatService } from '../../services/format/format.service';
import { environment } from './../../../../environments/environment';
import { loadAuth, networkChanged, resetAuth, setAuthPublicAddress } from './../../../store/auth-store/state/actions';
import {
  selectAccount,
  selectAuthStatus,
  selectNetworkName,
  selectPublicAddress
} from './../../../store/auth-store/state/selectors';

@Component({
  selector: 'app-use-cases-sidebar-header',
  templateUrl: './use-cases-sidebar-header.component.html',
  styleUrls: ['./use-cases-sidebar-header.component.scss']
})
export class UseCasesSidebarHeaderComponent implements OnInit, OnDestroy {
  @Input() networkFrozen = false;
  authStatusCodeTypes = AuthStatusCode;
  sidebarMode$: Observable<AuthStatusCode>;
  publicAddress$: Observable<string | null>;
  networkName$: Observable<string | null>;
  verifiedAccount$: Observable<IProfileAdded | null>;
  networkList: INetworkDetail[] = [];
  modalSub: Subscription;

  constructor(private store: Store, public formatService: FormatService, private web3LoginService: Web3LoginService) {}

  ngOnInit(): void {
    this.generateObs();
    this.networkSetUp();
  }

  networkSetUp(): void {
    this.networkList = this.web3LoginService
      .getNetworkDetailList()
      .filter(({ chainId }: INetworkDetail) => environment.networkSupported.includes(chainId));
  }

  generateObs(): void {
    this.sidebarMode$ = this.store.select(selectAuthStatus);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.verifiedAccount$ = this.store.select(selectAccount);
    this.networkName$ = this.store.select(selectNetworkName);
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  openLoginModal(): void {
    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: IModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(
            setAuthPublicAddress({
              publicAddress: state.data?.publicAddress as string,
              network: state.data?.network as INetworkDetail
            })
          );
          this.store.dispatch(loadAuth());
          this.web3LoginService.closeLoginModal();
          break;
      }
    });
  }

  logOut(): void {
    return this.store.dispatch(resetAuth());
  }

  changeNetwork(network: INetworkDetail): void {
    return this.store.dispatch(networkChanged({ network }));
  }
}
