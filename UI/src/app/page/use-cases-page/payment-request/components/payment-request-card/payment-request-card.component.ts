import { Component, Input } from '@angular/core';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';

@Component({
  selector: 'app-payment-request-card[paymentRequest]',
  templateUrl: './payment-request-card.component.html',
  styleUrls: ['./payment-request-card.component.scss']
})
export class PaymentRequestCardComponent {
  @Input() paymentRequest: IPaymentRequestState;
}
