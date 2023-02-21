import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationModule } from './certification/certification.module';
import { PaymentRequestModule } from './payment-request/payment-request.module';
import { UseCasesPageRoutingModule } from './use-cases-page-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CertificationModule, PaymentRequestModule, UseCasesPageRoutingModule]
})
export class UseCasesPageModule {}
