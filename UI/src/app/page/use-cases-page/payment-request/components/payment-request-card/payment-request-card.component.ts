import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { take } from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';
import { PriceFeedService } from './../../../../../shared/services/price-feed/price-feed.service';
import { WalletService } from './../../../../../shared/services/wallet/wallet.service';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';

@Component({
  selector: 'app-payment-request-card[paymentRequest][authStatus][paymentRequest][currentNetwork][paymentNetwork]',
  templateUrl: './payment-request-card.component.html',
  styleUrls: ['./payment-request-card.component.scss']
})
export class PaymentRequestCardComponent implements OnInit {
  AuthStatusCodeTypes = AuthStatusCode;
  @Input() paymentRequest: IPaymentRequestState;
  @Input() authStatus: AuthStatusCode;
  @Input() publicAddress: string | null;
  @Input() currentNetwork: INetworkDetail | null;
  @Input() paymentNetwork: INetworkDetail | null;
  @Output() openLoginModal = new EventEmitter<void>();
  @Output() submitPayment = new EventEmitter<{ priceValue: number }>();
  tokenConversionRate: number;

  constructor(
    private snackbar: MatSnackBar,
    private walletService: WalletService,
    private priceFeedService: PriceFeedService
  ) {}

  ngOnInit(): void {
    this.setUpCurrentPrice();
  }

  setUpCurrentPrice(): void {
    if (this.paymentRequest.payment.data?.usdEnabled as boolean) {
      this.priceFeedService
        .getCurrentPriceOfNativeToken(this.currentNetwork?.chainId as NetworkChainId)
        .then((result: number) => {
          this.tokenConversionRate = (this.paymentRequest?.payment?.data?.amount as number) / result;
        });
    }
  }

  submitAmount(): void {
    if (this.authStatus === AuthStatusCode.NotConnected) {
      this.snackbar.open('Please connect your wallet', '', { duration: 3000 });
      return;
    }

    this.walletService.networkIsMatching$.pipe(take(1)).subscribe((networkIsValid: boolean) => {
      if (!networkIsValid) {
        this.snackbar.open('Your current network selected is not matching with your wallet', 'Close', {
          duration: 3000
        });
        return;
      }
      if (this.paymentRequest?.payment?.data?.usdEnabled) {
        return this.submitPayment.emit({
          priceValue: this.tokenConversionRate * 1e18
        });
      } else {
        return this.submitPayment.emit({
          priceValue: (this.paymentRequest.payment.data?.amount as number) * 1e18
        });
      }
    });
  }
}
