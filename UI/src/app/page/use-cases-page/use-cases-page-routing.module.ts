import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCheckingGuard } from './guards/auth-checking/auth-checking.guard';
import { UseCasesPageComponent } from './use-cases-page.component';
import { UseCasesListComponent } from './components/use-cases-list/use-cases-list.component';
import { PaymentRequestContainerComponent } from './pages/payment-request/containers/payment-request-container/payment-request-container.component';
import { ActivityContainerComponent } from './pages/activity/containers/activity-container/activity-container.component';

const routes: Routes = [
  {
    path: '',
    component: UseCasesPageComponent,
    canActivate: [AuthCheckingGuard],
    children: [
      {
        path: 'services',
        component: UseCasesListComponent,
        data: { animation: 'services' }
      },
      {
        path: 'payment-request',
        component: PaymentRequestContainerComponent,
        data: { animation: 'payment-request' }
      },
      {
        path: 'activity',
        component: ActivityContainerComponent,
        data: { animation: 'activity' }
      },
      {
        path: '',
        redirectTo: 'services',
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
