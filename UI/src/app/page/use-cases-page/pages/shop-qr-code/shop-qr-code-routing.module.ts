import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopQrCodeMenuComponent } from './components/shop-qr-code-menu/shop-qr-code-menu.component';
import { ShopQrCodeCreationPageComponent } from './containers/shop-qr-code-creation-page/shop-qr-code-creation-page.component';
import { ShopQrCodeHomeComponent } from './containers/shop-qr-code-home/shop-qr-code-home.component';

const routes: Routes = [
  {
    path: '',
    component: ShopQrCodeHomeComponent,
    children: [
      {
        path: 'services',
        component: ShopQrCodeMenuComponent
      },
      {
        path: 'qr-code-creation',
        component: ShopQrCodeCreationPageComponent
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
