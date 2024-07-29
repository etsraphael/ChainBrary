import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UseCasesListComponent } from './components/use-cases-list/use-cases-list.component';
import { AuthCheckingGuard } from './guards/auth-checking/auth-checking.guard';
import { ActivityContainerComponent } from './pages/activity/containers/activity-container/activity-container.component';
import { PaymentRequestContainerComponent } from './pages/payment-request/containers/payment-request-container/payment-request-container.component';
import { UseCasesPageComponent } from './use-cases-page.component';

const routes: Routes = [
  {
    path: '',
    component: UseCasesPageComponent,
    canActivate: [AuthCheckingGuard],
    children: [
      {
        title: 'Services',
        path: 'services',
        component: UseCasesListComponent,
        data: { animation: 'services' }
      },
      {
        title: 'Payment Request',
        path: 'payment-request',
        component: PaymentRequestContainerComponent,
        data: { animation: 'payment-request' }
      },
      {
        title: 'Bid',
        path: 'bid',
        loadChildren: () => import('./pages/bid/bid.module').then((m) => m.BidModule),
        data: { animation: 'bid' }
      },
      {
        title: 'Document Locker',
        path: 'document-locker',
        loadChildren: () =>
          import('./pages/document-locker/document-locker.module').then((m) => m.DocumentLockerModule),
        data: { animation: 'document-locker' }
      },
      {
        title: 'Shop QR Code',
        path: 'shop-qr-code',
        loadChildren: () => import('./pages/shop-qr-code/shop-qr-code.module').then((m) => m.ShopQrCodeModule)
      },
      {
        title: 'Setup Token',
        path: 'setup-token',
        loadChildren: () => import('./pages/setup-token/setup-token.module').then((m) => m.SetupTokenModule)
      },
      {
        title: 'Activity',
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
