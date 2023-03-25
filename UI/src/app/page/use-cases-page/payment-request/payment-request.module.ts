import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from './../../../shared/components/shared-components.module';
import { PaymentRequestContainerComponent } from './containers/payment-request-container/payment-request-container.component';
import { PaymentPageComponent } from './containers/payment-page/payment-page.component';
import { PaymentRequestCardComponent } from './components/payment-request-card/payment-request-card.component';
import { RouterModule } from '@angular/router';
import { PaymentRequestMakerComponent } from './components/payment-request-maker/payment-request-maker.component';
import { MaterialModule } from './../../../module/material.module';

@NgModule({
  declarations: [
    PaymentRequestContainerComponent,
    PaymentPageComponent,
    PaymentRequestCardComponent,
    PaymentRequestMakerComponent
  ],
  imports: [CommonModule, SharedComponentsModule, RouterModule, MaterialModule]
})
export class PaymentRequestModule {}
