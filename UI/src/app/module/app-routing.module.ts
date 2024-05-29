import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayNowNotFoundPageComponent } from '../page/use-cases-page/pages/payment-request/containers/pay-now-not-found-page/pay-now-not-found-page.component';
import { PayNowPageComponent } from '../page/use-cases-page/pages/payment-request/containers/pay-now-page/pay-now-page.component';
import { PayNowSuccessfulPageComponent } from '../page/use-cases-page/pages/payment-request/containers/pay-now-successful-page/pay-now-successful-page.component';
import { PaymentPageComponent } from '../page/use-cases-page/pages/payment-request/containers/payment-page/payment-page.component';
import { QrCodeScanningPageComponent } from '../shared/components/qr-code-scanning-page/qr-code-scanning-page.component';

const routes: Routes = [
  {
    path: 'landing-page',
    loadChildren: () => import('../page/landing-page/landing-page.module').then((m) => m.LandingPageModule)
  },
  {
    path: 'use-cases',
    loadChildren: () => import('../page/use-cases-page/use-cases-page.module').then((m) => m.UseCasesPageModule)
  },
  {
    path: 'community-vaults',
    loadChildren: () =>
      import('../page/community-vaults-page/community-vaults-page.module').then((m) => m.CommunityVaultsPageModule)
  },
  {
    title: 'Pay Now',
    path: 'pay-now/:id',
    component: PayNowPageComponent
  },
  {
    title: 'Payment Not Found',
    path: 'payment-not-found',
    component: PayNowNotFoundPageComponent
  },
  {
    title: 'Scanning QR Code',
    path: 'qr-code-scanning',
    component: QrCodeScanningPageComponent
  },
  {
    title: 'Successful Payment',
    path: 'successful-payment',
    component: PayNowSuccessfulPageComponent
  },
  {
    title: 'Payment Request',
    path: 'payment-page/:id',
    component: PaymentPageComponent
  },
  {
    path: '**',
    redirectTo: 'landing-page',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
