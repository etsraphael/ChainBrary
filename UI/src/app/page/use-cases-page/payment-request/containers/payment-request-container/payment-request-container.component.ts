import { Component, OnDestroy, OnInit } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subscription, filter, take, takeUntil } from 'rxjs';
import { tokenList } from './../../../../../shared/data/tokenList';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IConversionToken, IProfileAdded, IToken, StoreState } from './../../../../../shared/interfaces';
import {
  accountChanged,
  networkChangeSuccess,
  resetAuth,
  setAuthPublicAddress
} from './../../../../../store/auth-store/state/actions';
import {
  selectAccount,
  selectAuthStatus,
  selectCurrentNetwork,
  selectPublicAddress,
  selectUserAccountIsLoading
} from './../../../../../store/auth-store/state/selectors';
import {
  applyConversionToken,
  initPaymentRequestMaker,
  switchToUsd,
  updatedToken
} from './../../../../../store/payment-request-store/state/actions';
import {
  selectPaymentConversion,
  selectPaymentToken
} from './../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-payment-request-container',
  templateUrl: './payment-request-container.component.html',
  styleUrls: ['./payment-request-container.component.scss']
})
export class PaymentRequestContainerComponent implements OnInit, OnDestroy {
  authStatus$: Observable<AuthStatusCode>;
  AuthStatusCodeTypes = AuthStatusCode;
  profileAccount$: Observable<IProfileAdded | null>;
  publicAddress$: Observable<string | null>;
  userAccountIsLoading$: Observable<boolean>;
  currentNetwork$: Observable<INetworkDetail | null>;
  paymentToken$: Observable<IToken | null>;
  paymentConversion$: Observable<StoreState<IConversionToken>>;
  resetTransaction$: Observable<Action>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

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
    this.paymentConversion$ = this.store.select(selectPaymentConversion);
    this.resetTransaction$ = this.actions$.pipe(
      ofType(resetAuth, accountChanged, networkChangeSuccess, setAuthPublicAddress),
      takeUntil(this.destroyed$)
    );
  }

  setUpTokenChoice(tokenId: string): void {
    const tokenFound: IToken = tokenList.find((token) => token.tokenId === tokenId) as IToken;
    return this.store.dispatch(updatedToken({ token: tokenFound }));
  }

  applyConversionToken(amount: number): Subscription {
    return this.currentNetwork$
      .pipe(
        take(1),
        filter((network) => !!network)
      )
      .subscribe(() => this.store.dispatch(applyConversionToken({ amount })));
  }

  switchToUsd(priceInUsdEnabled: boolean): void {
    return this.store.dispatch(switchToUsd({ priceInUsdEnabled }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
