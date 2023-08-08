import { Component, OnInit } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tokenList } from './../../../../../shared/data/tokenList';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IProfileAdded, IToken } from './../../../../../shared/interfaces';
import {
  selectAccount,
  selectAuthStatus,
  selectCurrentNetwork,
  selectPublicAddress,
  selectUserAccountIsLoading
} from './../../../../../store/auth-store/state/selectors';
import { initPaymentRequestMaker, selectToken } from './../../../../../store/payment-request-store/state/actions';
import { selectPaymentToken } from './../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-payment-request-container',
  templateUrl: './payment-request-container.component.html',
  styleUrls: ['./payment-request-container.component.scss']
})
export class PaymentRequestContainerComponent implements OnInit {
  authStatus$: Observable<AuthStatusCode>;
  AuthStatusCodeTypes = AuthStatusCode;
  profileAccount$: Observable<IProfileAdded | null>;
  publicAddress$: Observable<string | null>;
  userAccountIsLoading$: Observable<boolean>;
  currentNetwork$: Observable<INetworkDetail | null>;
  paymentToken$: Observable<IToken | null>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.generateObs();
    this.callActions();
  }

  callActions(): void {
    this.store.dispatch(initPaymentRequestMaker());
  }

  generateObs(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.profileAccount$ = this.store.select(selectAccount);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.userAccountIsLoading$ = this.store.select(selectUserAccountIsLoading);
    this.currentNetwork$ = this.store.select(selectCurrentNetwork);
    this.paymentToken$ = this.store.select(selectPaymentToken);
  }

  setUpTokenChoice(tokenId: string): void {
    const tokenFound: IToken | null = tokenList.find((token) => token.tokenId === tokenId) || null;
    return this.store.dispatch(selectToken({ token: tokenFound }));
  }
}
