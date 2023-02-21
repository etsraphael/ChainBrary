import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRequestRoutingModule } from './payment-request-routing.module';
import { PaymentRequestContainerComponent } from './containers/payment-request-container/payment-request-container.component';

@NgModule({
  declarations: [PaymentRequestContainerComponent],
  imports: [CommonModule, PaymentRequestRoutingModule]
})
export class PaymentRequestModule {}
