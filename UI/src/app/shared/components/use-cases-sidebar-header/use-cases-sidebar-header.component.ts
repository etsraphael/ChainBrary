import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthStatusCode } from '../../enum';
import { IProfileAdded } from '../../interfaces';
import { FormatService } from '../../services/format/format.service';
import { loadAuth, resetAuth, setAuthPublicAddress } from './../../../store/auth-store/state/actions';
import { selectAccount, selectAuthStatus, selectPublicAddress } from './../../../store/auth-store/state/selectors';

@Component({
  selector: 'app-use-cases-sidebar-header',
  templateUrl: './use-cases-sidebar-header.component.html',
  styleUrls: ['./use-cases-sidebar-header.component.scss']
})
export class UseCasesSidebarHeaderComponent implements OnInit, OnDestroy {
  @Input() certificationBtnVisible = true;
  authStatusCodeTypes = AuthStatusCode;
  sidebarMode$: Observable<AuthStatusCode>;
  publicAddress$: Observable<string | null>;
  verifiedAccount$: Observable<IProfileAdded | null>;
  modalSub: Subscription;

  constructor(
    private store: Store,
    public formatService: FormatService,
    private web3LoginService: Web3LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sidebarMode$ = this.store.select(selectAuthStatus);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.verifiedAccount$ = this.store.select(selectAccount);
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  openLoginModal(): void {
    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(setAuthPublicAddress({ publicAddress: state.data?.publicAddress as string }));
          this.store.dispatch(loadAuth());
          this.web3LoginService.closeLoginModal();
          break;
      }
    });
  }

  logOut(): void {
    return this.store.dispatch(resetAuth());
  }

  goToCertification(): Promise<boolean> {
    return this.router.navigate(['/use-cases/certification']);
  }
}
