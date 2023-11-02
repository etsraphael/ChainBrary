import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from './../../shared/components/shared-components.module';
import { UseCasesPageRoutingModule } from './use-cases-page-routing.module';
import { UseCasesPageComponent } from './use-cases-page.component';
import { PaymentRequestModule } from './pages/payment-request/payment-request.module';
import { ActivityModule } from './pages/activity/activity.module';

@NgModule({
  declarations: [UseCasesPageComponent],
  imports: [CommonModule, PaymentRequestModule, UseCasesPageRoutingModule, SharedComponentsModule, ActivityModule]
})
export class UseCasesPageModule {}
