import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { Observable, ReplaySubject, filter, map, take, takeUntil } from 'rxjs';
import { AuthStatusCode, TokenPair } from './../../../../../shared/enum';
import { IToken } from './../../../../../shared/interfaces';
import { PriceFeedService } from './../../../../../shared/services/price-feed/price-feed.service';
import { WalletService } from './../../../../../shared/services/wallet/wallet.service';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';

@Component({
  selector:
    'app-payment-request-card[paymentRequest][authStatus][paymentRequest][currentNetworkObs][paymentNetwork][canTransfer]',
  templateUrl: './payment-request-card.component.html',
  styleUrls: ['./payment-request-card.component.scss']
})
export class PaymentRequestCardComponent implements OnInit, OnDestroy {
  AuthStatusCodeTypes = AuthStatusCode;
  @Input() paymentRequest: IPaymentRequestState;
  @Input() authStatus: AuthStatusCode;
  @Input() publicAddress: string | null;
  @Input() currentNetworkObs: Observable<INetworkDetail | null>;
  @Input() paymentNetwork: INetworkDetail | null;
  @Input() canTransfer: boolean;
  @Input() canTransferError: string | null;
  @Output() openLoginModal = new EventEmitter<void>();
  @Output() submitPayment = new EventEmitter<{ priceValue: number }>();
  @Output() approveSmartContract = new EventEmitter<void>();
  tokenConversionRate: number;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private snackbar: MatSnackBar,
    private walletService: WalletService,
    private priceFeedService: PriceFeedService
  ) {}

  get usdIsEnabled(): boolean {
    return this.paymentRequest.payment.data?.usdEnabled as boolean;
  }

  get paymentToken(): IToken {
    return this.paymentRequest.token as IToken;
  }

  get conversionRateHasError(): boolean {
    return (!this.usdIsEnabled && this.tokenConversionRate === 0) || (this.usdIsEnabled && !this.tokenConversionRate);
  }

  get tokenIsNative(): boolean {
    return this.paymentToken.nativeToChainId === this.paymentNetwork?.chainId;
  }

  ngOnInit(): void {
    if (this.usdIsEnabled) this.listenToNetworkChange();
  }

  listenToNetworkChange(): void {
    this.currentNetworkObs
      .pipe(
        filter((currentNetwork: INetworkDetail | null) => currentNetwork !== null),
        map((currentNetwork: INetworkDetail | null) => currentNetwork as INetworkDetail),
        takeUntil(this.destroyed$)
      )
      .subscribe((currentNetwork: INetworkDetail) => this.setUpConversion(currentNetwork));
  }

  setUpConversion(currentNetwork: INetworkDetail): void {
    // if payment token is native token
    if (this.paymentToken.nativeToChainId === currentNetwork.chainId) {
      this.priceFeedService
        .getCurrentPriceOfNativeToken(currentNetwork.chainId as NetworkChainId)
        .then(
          (result: number) => (this.tokenConversionRate = (this.paymentRequest.payment.data?.amount as number) / result)
        )
        .catch(() => this.resetConversion());
    }
    // if payment token is not native token
    else if (this.paymentRequest.network?.chainId === currentNetwork.chainId) {
      const priceFeed: TokenPair = this.paymentToken.networkSupport.find(
        (network) => network.chainId === currentNetwork.chainId
      )?.priceFeed[0] as TokenPair;
      if (priceFeed) {
        this.priceFeedService
          .getCurrentPrice(priceFeed, currentNetwork.chainId as NetworkChainId)
          .then(
            (result: number) =>
              (this.tokenConversionRate = (this.paymentRequest?.payment?.data?.amount as number) / result)
          )
          .catch(() => this.resetConversion());
      }
    } else {
      this.resetConversion();
    }
  }

  resetConversion(): void {
    this.tokenConversionRate = 0;
  }

  submitAmount(): void {
    if (this.authStatus === AuthStatusCode.NotConnected) {
      this.snackbar.open('Please connect your wallet', '', { duration: 3000 });
      return;
    }

    this.walletService.networkIsMatching$.pipe(take(1)).subscribe((networkIsValid: boolean) => {
      if (!networkIsValid) {
        this.snackbar.open('Network mismatch with wallet', 'Close', { duration: 3000 });
        return;
      }

      const amount: number = this.paymentRequest?.payment?.data?.usdEnabled
        ? this.tokenConversionRate
        : (this.paymentRequest.payment.data?.amount as number);

      this.submitPayment.emit({ priceValue: amount * 1e18 });
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
