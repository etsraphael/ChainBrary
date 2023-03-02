import { Component, OnInit } from '@angular/core';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { setAuthPublicAddress } from './../../../../../store/auth-store/state/actions';
import { AuthStatusCode } from './../../../../../shared/enum';
import { selectAuthStatus } from './../../../../../store/auth-store/state/selectors';

@Component({
  selector: 'app-certification-container',
  templateUrl: './certification-container.component.html',
  styleUrls: ['./certification-container.component.scss']
})
export class CertificationContainerComponent implements OnInit {
  authStatus$: Observable<AuthStatusCode>;
  modalSub: Subscription;

  constructor(private store: Store, private web3LoginService: Web3LoginService) {}

  ngOnInit(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
  }

  openLoginModal(): void {
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
