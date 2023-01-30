import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'payment-request',
    loadChildren: () => import('./page/payment-request/payment-request.module').then((m) => m.PaymentRequestModule)
  },
  {
    path: 'certification',
    loadChildren: () => import('./page/certification/certification.module').then((m) => m.CertificationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
