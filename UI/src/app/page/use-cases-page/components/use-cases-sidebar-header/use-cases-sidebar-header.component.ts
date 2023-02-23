import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { setAuthPublicAddress } from 'src/app/store/auth-store/state/actions';
import { AuthStatusCode } from './../../../../shared/enum';
import { IProfileAdded } from './../../../../shared/interfaces';
import { FormatService } from './../../../../shared/services/format/format.service';
import { selectAccount, selectPublicAddress, selectSideBarMode } from './../../../../store/auth-store/state/selectors';
@Component({
  selector: 'app-use-cases-sidebar-header',
  templateUrl: './use-cases-sidebar-header.component.html',
  styleUrls: ['./use-cases-sidebar-header.component.scss']
})
export class UseCasesSidebarHeaderComponent implements OnInit, OnDestroy {
  authStatusCodeTypes = AuthStatusCode;
  sidebarMode$: Observable<AuthStatusCode>;
  publicAddress$: Observable<string | null>;
  verifiedAccount$: Observable<IProfileAdded | null>;
  modalSub: Subscription;

  constructor(private store: Store, public formatService: FormatService, private web3LoginService: Web3LoginService) {}

  ngOnInit(): void {
    this.sidebarMode$ = this.store.select(selectSideBarMode);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.verifiedAccount$ = this.store.select(selectAccount);
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  openLoginModal(): void {
    this.web3LoginService.openLoginModal();

    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(setAuthPublicAddress({ publicAddress: state.data?.publicAddress as string }));
          this.web3LoginService.closeLoginModal();
          break;
      }
    });
  }
}
