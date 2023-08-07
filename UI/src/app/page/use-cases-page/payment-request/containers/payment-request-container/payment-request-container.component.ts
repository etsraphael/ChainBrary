import { Component, OnInit } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectToken } from 'src/app/store/payment-request-store/state/actions';
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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.profileAccount$ = this.store.select(selectAccount);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.userAccountIsLoading$ = this.store.select(selectUserAccountIsLoading);
    this.currentNetwork$ = this.store.select(selectCurrentNetwork);
  }

  setUpTokenChoice(tokenId: string): void {
    console.log('tokenId', tokenId);
    const tokenFound: IToken | null = tokenList.find((token) => token.tokenId === tokenId) || null;

    console.log('tokenFound', tokenFound);

    return this.store.dispatch(selectToken({ token: tokenFound }));
  }
}
