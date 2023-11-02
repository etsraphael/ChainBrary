import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from './../../shared/components/shared-components.module';
import { ActivityModule } from './pages/activity/activity.module';
import { BidModule } from './pages/bid/bid.module';
import { PaymentRequestModule } from './pages/payment-request/payment-request.module';
import { UseCasesPageRoutingModule } from './use-cases-page-routing.module';
import { UseCasesPageComponent } from './use-cases-page.component';

@NgModule({
  declarations: [UseCasesPageComponent],
  imports: [CommonModule, PaymentRequestModule, UseCasesPageRoutingModule, SharedComponentsModule, ActivityModule, BidModule]
})
export class UseCasesPageModule {}
