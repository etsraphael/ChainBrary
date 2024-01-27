import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { INetworkDetail, WalletProvider, Web3LoginComponent, Web3LoginService } from '@chainbrary/web3-login';
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
import { environment } from './../../../../../../../environments/environment';
import { AuthStatusCode } from './../../../../../../shared/enum';
import { INativeToken, IPaymentRequest, ITransactionCard } from './../../../../../../shared/interfaces';
import {
  accountChanged,
  networkChange,
  networkChangeSuccess,
  setAuthPublicAddress
} from './../../../../../../store/auth-store/state/actions';
import {
  selectAuthStatus,
  selectCurrentNetwork,
  selectPublicAddress
} from './../../../../../../store/auth-store/state/selectors';
import { selectWalletConnected } from './../../../../../../store/global-store/state/selectors';
import {
  approveTokenAllowance,
  generatePaymentRequest,
  sendAmount,
  smartContractCanTransfer
} from './../../../../../../store/payment-request-store/state/actions';
import { IPaymentRequestState } from './../../../../../../store/payment-request-store/state/interfaces';
import {
  selectCardIsLoading,
  selectIsNonNativeToken,
  selectIsPaymentMaker,
  selectPaymentNetwork,
  selectPaymentRequest,
  selectSmartContractCanTransfer,
  selectSmartContractCanTransferError
} from './../../../../../../store/payment-request-store/state/selectors';
import { selectRecentTransactionsByComponent } from './../../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  nativeTokenInfo: INativeToken;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private web3LoginService: Web3LoginService,
    private _snackBar: MatSnackBar,
    private actions$: Actions
  ) {
    this.setUpId();
  }

  readonly selectPaymentRequestState$: Observable<IPaymentRequestState> = this.store.select(selectPaymentRequest);
  readonly paymentIsLoading$: Observable<boolean> = this.store.select(selectCardIsLoading);
  readonly authStatus$: Observable<AuthStatusCode> = this.store.select(selectAuthStatus);
  readonly publicAddress$: Observable<string | null> = this.store.select(selectPublicAddress);
  readonly currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  readonly paymentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectPaymentNetwork);
  readonly smartContractCanTransfer$: Observable<boolean> = this.store.select(selectSmartContractCanTransfer);
  readonly canTransferError$: Observable<string | null> = this.store.select(selectSmartContractCanTransferError);
  readonly isNonNativeToken$: Observable<boolean> = this.store.select(selectIsNonNativeToken);
  readonly isPaymentMaker: Observable<boolean> = this.store.select(selectIsPaymentMaker);
  readonly walletConnected$: Observable<WalletProvider | null> = this.store.select(selectWalletConnected);
  readonly transactionCards$: Observable<ITransactionCard[]> = this.store.select(
    selectRecentTransactionsByComponent('PaymentPageComponent')
  );
  readonly AuthStatusCodeTypes = AuthStatusCode;

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
    this.setUpMessage();
    this.generateSubscription();
  }

  generateSubscription(): void {
    this.actions$
      .pipe(ofType(accountChanged, networkChangeSuccess), takeUntil(this.destroyed$))
      .subscribe(() => this.setUpId());

    this.actions$.pipe(ofType(setAuthPublicAddress)).subscribe(() => this.store.dispatch(smartContractCanTransfer()));
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

  openLoginModal(): MatDialogRef<Web3LoginComponent> {
    return this.web3LoginService.openLoginModal();
  }

  handleNetwork(isSupportedAction: () => void): Subscription {
    return this.paymentSelectedInvalid$
      .pipe(
        take(1),
        switchMap((isInvalid: boolean) => {
          if (isInvalid) {
            this._snackBar.open('Network not matching', $localize`:@@commonWords:Close`, { duration: 2000 });
            return EMPTY;
          }
          return this.web3LoginService.currentNetwork$;
        }),
        filter((network: INetworkDetail | null) => !!network),
        map((network: INetworkDetail | null) => network as INetworkDetail)
      )
      .subscribe((network: INetworkDetail) => {
        if (!environment.contracts.bridgeTransfer.networkSupported.includes(network.chainId)) {
          this._snackBar.open('Network not supported', $localize`:@@commonWords:Close`, { duration: 2000 });
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
