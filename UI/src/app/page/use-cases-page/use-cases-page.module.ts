import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CertificationModule } from './certification/certification.module';
import { UseCasesSidebarHeaderComponent } from './components/use-cases-sidebar-header/use-cases-sidebar-header.component';
import { UseCasesSidebarComponent } from './components/use-cases-sidebar/use-cases-sidebar.component';
import { PaymentRequestModule } from './payment-request/payment-request.module';
import { UseCasesPageRoutingModule } from './use-cases-page-routing.module';
import { UseCasesPageComponent } from './use-cases-page.component';

@NgModule({
  declarations: [UseCasesSidebarComponent, UseCasesSidebarHeaderComponent, UseCasesPageComponent],
  imports: [CommonModule, CertificationModule, PaymentRequestModule, UseCasesPageRoutingModule]
})
export class UseCasesPageModule {}
