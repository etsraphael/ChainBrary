import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { IModalState, INetworkDetail, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  EMPTY,
  Observable,
  ReplaySubject,
  Subscription,
  combineLatest,
  filter,
  map,
  switchMap,
  take,
  takeUntil
} from 'rxjs';
import { environment } from './../../../../../../environments/environment';
import { AuthStatusCode } from './../../../../../shared/enum';
import { INativeToken, IPaymentRequest, ITransactionCard } from './../../../../../shared/interfaces';
import {
  accountChanged,
  networkChange,
  networkChangeSuccess,
  setAuthPublicAddress
} from './../../../../../store/auth-store/state/actions';
import {
  selectAuthStatus,
  selectCurrentNetwork,
  selectPublicAddress
} from './../../../../../store/auth-store/state/selectors';
import {
  approveTokenAllowance,
  generatePaymentRequest,
  sendAmount
} from './../../../../../store/payment-request-store/state/actions';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';
import {
  selectCardIsLoading,
  selectIsNonNativeToken,
  selectIsPaymentMaker,
  selectPaymentNetwork,
  selectPaymentRequest,
  selectSmartContractCanTransfer,
  selectSmartContractCanTransferError
} from './../../../../../store/payment-request-store/state/selectors';
import { selectRecentTransactionsByComponent } from './../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  AuthStatusCodeTypes = AuthStatusCode;
  selectPaymentRequestState$: Observable<IPaymentRequestState>;
  paymentIsLoading$: Observable<boolean>;
  canTransferError$: Observable<string | null>;
  authStatus$: Observable<AuthStatusCode>;
  isNonNativeToken$: Observable<boolean>;
  publicAddress$: Observable<string | null>;
  transactionCards$: Observable<ITransactionCard[]>;
  currentNetwork$: Observable<INetworkDetail | null>;
  paymentNetwork$: Observable<INetworkDetail | null>;
  smartContractCanTransfer$: Observable<boolean>;
  isPaymentMaker: Observable<boolean>;
  nativeTokenInfo: INativeToken;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private web3LoginService: Web3LoginService,
    private _snackBar: MatSnackBar,
    private actions$: Actions,
    private meta: Meta
  ) {
    this.setUpId();
  }

  get paymentSelectedInvalid$(): Observable<boolean> {
    return combineLatest([this.currentNetwork$, this.paymentNetwork$]).pipe(
      map(([currentNetwork, paymentNetwork]) =>
        currentNetwork && paymentNetwork ? currentNetwork.chainId !== paymentNetwork.chainId : false
      )
    );
  }

  get tokenInfo(): string {
    return `${this.nativeTokenInfo.name} (${this.nativeTokenInfo.symbol})`;
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
    this.setUpMessage();
    this.generateSubscription();
    this.setUpMetaData();
  }

  generateSubscription(): void {
    this.actions$
      .pipe(ofType(accountChanged, networkChangeSuccess), takeUntil(this.destroyed$))
      .subscribe(() => this.setUpId());
  }

  generateObs(): void {
    this.selectPaymentRequestState$ = this.store.select(selectPaymentRequest);
    this.paymentIsLoading$ = this.store.select(selectCardIsLoading);
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.transactionCards$ = this.store.select(selectRecentTransactionsByComponent('PaymentPageComponent'));
    this.currentNetwork$ = this.store.select(selectCurrentNetwork);
    this.paymentNetwork$ = this.store.select(selectPaymentNetwork);
    this.smartContractCanTransfer$ = this.store.select(selectSmartContractCanTransfer);
    this.canTransferError$ = this.store.select(selectSmartContractCanTransferError);
    this.isNonNativeToken$ = this.store.select(selectIsNonNativeToken);
    this.isPaymentMaker = this.store.select(selectIsPaymentMaker);
  }

  setUpMessage(): void {
    this.selectPaymentRequestState$
      .pipe(
        take(1),
        filter((state: IPaymentRequestState) => !!state?.payment?.data?.usdEnabled),
        map((state: IPaymentRequestState) => state?.payment?.data as IPaymentRequest),
        map((paymentRequest: IPaymentRequest) => paymentRequest as IPaymentRequest)
      )
      .subscribe(
        (payment: IPaymentRequest) =>
          (this.nativeTokenInfo = this.web3LoginService.getNetworkDetailByChainId(payment.chainId).nativeCurrency)
      );
  }

  openLoginModal(): Subscription {
    return this.web3LoginService
      .openLoginModal()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state: IModalState) => {
        switch (state.type) {
          case ModalStateType.SUCCESS:
            this.store.dispatch(
              setAuthPublicAddress({
                publicAddress: state.data?.publicAddress as string,
                network: state.data?.network as INetworkDetail
              })
            );
            this.web3LoginService.closeLoginModal();
            break;
        }
      });
  }

  handleNetwork(isSupportedAction: () => void): Subscription {
    return this.paymentSelectedInvalid$
      .pipe(
        take(1),
        switchMap((isInvalid: boolean) => {
          if (isInvalid) {
            this._snackBar.open('Network not matching', 'Close', { duration: 2000 });
            return EMPTY;
          }
          return this.web3LoginService.currentNetwork$;
        }),
        filter((network: INetworkDetail | null) => !!network),
        map((network: INetworkDetail | null) => network as INetworkDetail)
      )
      .subscribe((network: INetworkDetail) => {
        if (!environment.contracts.bridgeTransfer.networkSupported.includes(network.chainId)) {
          this._snackBar.open('Network not supported', 'Close', { duration: 2000 });
          return;
        }
        isSupportedAction();
      });
  }

  submitPayment(payload: { priceValue: number }): Subscription {
    return this.handleNetwork(() => this.store.dispatch(sendAmount({ priceValue: String(payload.priceValue) })));
  }

  approveSmartContract(): Subscription {
    return this.handleNetwork(() => this.store.dispatch(approveTokenAllowance()));
  }

  changeNetwork(): Subscription {
    return this.paymentNetwork$
      .pipe(
        take(1),
        filter((network: INetworkDetail | null) => !!network),
        map((network: INetworkDetail | null) => network as INetworkDetail)
      )
      .subscribe((network: INetworkDetail) => this.store.dispatch(networkChange({ network })));
  }

  setUpMetaData(): void {
    const title = 'Payment Request';
    const description =
      "ChainBrary's secure payment portal. Fast, secure, and reliable cryptocurrency transactions start here. Verify, confirm, and go!";
    const url = 'https://www.chainbrary.com';
    const image = 'https://www.chainbrary.com/assets/images/easy_payment_money_transaction_colorful.png';

    // Set Primary Meta Tags
    this.meta.addTags([
      { name: 'title', content: title },
      { name: 'description', content: description },

      // Set Open Graph / Facebook meta tags
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },

      // Set Twitter meta tags
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: url },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: image }
    ]);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
