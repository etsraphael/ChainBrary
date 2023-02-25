import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-request-container',
  templateUrl: './payment-request-container.component.html',
  styleUrls: ['./payment-request-container.component.scss']
})
export class PaymentRequestContainerComponent {
  certifficationCardVisible = true;

  hideCertifficationCard(): void {
    this.certifficationCardVisible = false;
  }
}
