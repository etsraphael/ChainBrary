import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentPageComponent } from '../page/use-cases-page/pages/payment-request/containers/payment-page/payment-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../page/landing-page/landing-page.module').then((m) => m.LandingPageModule)
  },
  {
    path: 'use-cases',
    loadChildren: () => import('../page/use-cases-page/use-cases-page.module').then((m) => m.UseCasesPageModule)
  },
  {
    path: 'payment-page/:id',
    component: PaymentPageComponent,
    title: 'Payment Request'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
