import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from './../../../shared/components/shared-components.module';
import { PaymentRequestContainerComponent } from './containers/payment-request-container/payment-request-container.component';

@NgModule({
  declarations: [PaymentRequestContainerComponent],
  imports: [CommonModule, SharedComponentsModule]
})
export class PaymentRequestModule {}
