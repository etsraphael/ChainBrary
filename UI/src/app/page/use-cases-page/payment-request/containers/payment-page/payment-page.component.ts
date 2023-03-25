import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectAuthStatus, selectPublicAddress } from './../../../../../store/auth-store/state/selectors';
import { AuthStatusCode } from './../../../../../shared/enum';
import { loadAuth, setAuthPublicAddress } from './../../../../../store/auth-store/state/actions';
import { generatePaymentRequest } from './../../../../../store/payment-request-store/state/actions';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';
import {
  selectCardIsLoading,
  selectPaymentRequest
} from './../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  selectPaymentRequestState$: Observable<IPaymentRequestState>;
  cardIsLoading$: Observable<boolean>;
  modalSub: Subscription;
  authStatus$: Observable<AuthStatusCode>;
  publicAddress$: Observable<string | null>;

  constructor(private route: ActivatedRoute, private store: Store, private web3LoginService: Web3LoginService) {
    this.setUpId();
  }

  setUpId(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.store.dispatch(generatePaymentRequest({ encodedRequest: params['id'] }));
      }
    });
  }

  ngOnInit(): void {
    this.generateObs();
  }

  generateObs(): void {
    this.selectPaymentRequestState$ = this.store.select(selectPaymentRequest);
    this.cardIsLoading$ = this.store.select(selectCardIsLoading);
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.publicAddress$ = this.store.select(selectPublicAddress);
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

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }
}
