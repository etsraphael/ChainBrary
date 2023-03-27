import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';

@Component({
  selector: 'app-payment-request-card[paymentRequest][authStatus][paymentRequest]',
  templateUrl: './payment-request-card.component.html',
  styleUrls: ['./payment-request-card.component.scss']
})
export class PaymentRequestCardComponent {
  AuthStatusCodeTypes = AuthStatusCode;
  @Input() paymentRequest: IPaymentRequestState;
  @Input() authStatus: AuthStatusCode;
  @Input() publicAddress: string | null;
  @Output() openLoginModal = new EventEmitter<void>();
  @Output() submitPayment = new EventEmitter<{ priceValue: number; to: string[] }>();

  constructor(private snackbar: MatSnackBar) {}

  submitAmount(): void {
    if (this.authStatus === AuthStatusCode.NotConnected) {
      this.snackbar.open('Please connect your wallet', '', { duration: 3000 });
      return;
    }

    return this.submitPayment.emit({
      priceValue: (this.paymentRequest.payment.data?.amount as number) * 1e18,
      to: [this.paymentRequest.payment.data?.publicAddress as string]
    });
  }
}
