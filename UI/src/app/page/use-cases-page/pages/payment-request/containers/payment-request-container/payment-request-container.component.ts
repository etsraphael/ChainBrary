import { Component, OnDestroy, OnInit } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subscription, filter, take, takeUntil } from 'rxjs';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { tokenList } from './../../../../../../shared/data/tokenList';
import { IProfileAdded, IToken } from './../../../../../../shared/interfaces';
import {
  accountChanged,
  networkChangeSuccess,
  resetAuth,
  setAuthPublicAddress
} from './../../../../../../store/auth-store/state/actions';
import {
  selectAccount,
  selectCurrentNetwork,
  selectIsConnected,
  selectPublicAddress,
  selectUserAccountIsLoading
} from './../../../../../../store/auth-store/state/selectors';
import {
  applyConversionToken,
  initPaymentRequestMaker,
  updatedToken
} from './../../../../../../store/payment-request-store/state/actions';
import {
  DataConversionStore,
  selectPaymentConversion,
  selectPaymentToken
} from './../../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-payment-request-container',
  templateUrl: './payment-request-container.component.html',
  styleUrls: ['./payment-request-container.component.scss']
})
export class PaymentRequestContainerComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  readonly headerPayload: IHeaderBodyPage = {
    title: $localize`:@@paymentRequestTitle:Payment Request`,
    goBackLink: '/use-cases/services',
    description: $localize`:@@paymentRequestDescription:Easily generate and share payment requests via URL or QR code. This feature primarily focuses on creating payment requests, allowing users to lock in prices in USD, ensuring accuracy despite token value fluctuations. A variety of tokens are available to accommodate diverse needs.`
  };

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  readonly selectIsConnected$: Observable<boolean> = this.store.select(selectIsConnected);
  readonly profileAccount$: Observable<IProfileAdded | null> = this.store.select(selectAccount);
  readonly publicAddress$: Observable<string | null> = this.store.select(selectPublicAddress);
  readonly userAccountIsLoading$: Observable<boolean> = this.store.select(selectUserAccountIsLoading);
  readonly currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  readonly paymentToken$: Observable<IToken | null> = this.store.select(selectPaymentToken);
  readonly paymentConversion$: Observable<DataConversionStore> = this.store.select(selectPaymentConversion);
  readonly resetTransaction$: Observable<Action> = this.actions$.pipe(
    ofType(resetAuth, accountChanged, networkChangeSuccess, setAuthPublicAddress),
    takeUntil(this.destroyed$)
  );

  ngOnInit(): void {
    this.callActions();
  }

  callActions(): void {
    this.store.dispatch(initPaymentRequestMaker());
  }

  setUpTokenChoice(tokenId: string): void {
    const tokenFound: IToken = tokenList.find((token) => token.tokenId === tokenId) as IToken;
    return this.store.dispatch(updatedToken({ token: tokenFound }));
  }

  applyConversionToken(payload: { amount: number; amountInUsd: boolean }): Subscription {
    return this.currentNetwork$
      .pipe(
        take(1),
        filter((network) => !!network)
      )
      .subscribe(() => this.store.dispatch(applyConversionToken(payload)));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
