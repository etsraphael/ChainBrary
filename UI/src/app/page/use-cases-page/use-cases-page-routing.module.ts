import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentRequestContainerComponent } from './payment-request/containers/payment-request-container/payment-request-container.component';
import { UseCasesPageComponent } from './use-cases-page.component';
import { AuthCheckingGuard } from './guards/auth-checking/auth-checking.guard';

const routes: Routes = [
  {
    path: '',
    component: UseCasesPageComponent,
    canActivateChild: [AuthCheckingGuard],
    children: [
      {
        path: 'payment-request',
        component: PaymentRequestContainerComponent
      },
      {
        path: '',
        redirectTo: 'payment-request',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UseCasesPageRoutingModule {}
