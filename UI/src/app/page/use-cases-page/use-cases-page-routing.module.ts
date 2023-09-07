import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityContainerComponent } from './activity/containers/activity-container/activity-container.component';
import { AuthCheckingGuard } from './guards/auth-checking/auth-checking.guard';
import { PaymentRequestContainerComponent } from './payment-request/containers/payment-request-container/payment-request-container.component';
import { UseCasesPageComponent } from './use-cases-page.component';

const routes: Routes = [
  {
    path: '',
    component: UseCasesPageComponent,
    canActivate: [AuthCheckingGuard],
    children: [
      {
        path: 'payment-request',
        component: PaymentRequestContainerComponent
      },
      {
        path: 'activity',
        component: ActivityContainerComponent
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
