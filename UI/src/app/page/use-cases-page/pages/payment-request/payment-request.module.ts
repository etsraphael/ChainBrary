import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { PaymentRequestCardComponent } from './components/payment-request-card/payment-request-card.component';
import { PaymentRequestMakerComponent } from './components/payment-request-maker/payment-request-maker.component';
import { PaymentRequestPriceSettingsComponent } from './components/payment-request-price-settings/payment-request-price-settings.component';
import { PaymentRequestProfileSettingsComponent } from './components/payment-request-profile-settings/payment-request-profile-settings.component';
import { PaymentRequestReviewComponent } from './components/payment-request-review/payment-request-review.component';
import { PayNowPageComponent } from './containers/pay-now-page/pay-now-page.component';
import { PaymentPageComponent } from './containers/payment-page/payment-page.component';
import { PaymentRequestContainerComponent } from './containers/payment-request-container/payment-request-container.component';

@NgModule({
  declarations: [
    PaymentRequestContainerComponent,
    PaymentPageComponent,
    PaymentRequestCardComponent,
    PaymentRequestMakerComponent,
    PaymentRequestReviewComponent,
    PaymentRequestPriceSettingsComponent,
    PaymentRequestProfileSettingsComponent,
    PayNowPageComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule
  ]
})
export class PaymentRequestModule {}
