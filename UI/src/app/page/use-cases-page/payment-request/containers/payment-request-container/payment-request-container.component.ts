import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IProfileAdded } from './../../../../../shared/interfaces';
import {
  selectAccount,
  selectAuthStatus,
  selectCurrentNetwork,
  selectPublicAddress,
  selectUserAccountIsLoading
} from './../../../../../store/auth-store/state/selectors';
import { INetworkDetail } from '@chainbrary/web3-login';

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

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.profileAccount$ = this.store.select(selectAccount);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.userAccountIsLoading$ = this.store.select(selectUserAccountIsLoading);
    this.currentNetwork$ = this.store.select(selectCurrentNetwork);
  }
}
