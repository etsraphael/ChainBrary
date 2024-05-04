import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopQrCodeHomeComponent } from './containers/shop-qr-code-home/shop-qr-code-home.component';
import { ShopQrCodeMenuComponent } from './components/shop-qr-code-menu/shop-qr-code-menu.component';

const routes: Routes = [
  {
    path: '',
    component: ShopQrCodeHomeComponent,
    children: [
      {
        path: 'services',
        component: ShopQrCodeMenuComponent,
        data: { animation: 'shop-qr-code-services' }
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
export class ShopQRCodeRoutingModule {}
