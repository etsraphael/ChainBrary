import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { ShopQrCodeMenuComponent } from './components/shop-qr-code-menu/shop-qr-code-menu.component';
import { ShopQrCodePrinterComponent } from './components/shop-qr-code-printer/shop-qr-code-printer.component';
import { ShopQrCodeVisualComponent } from './components/shop-qr-code-visual/shop-qr-code-visual.component';
import { ShopQrCodeCreationPageComponent } from './containers/shop-qr-code-creation-page/shop-qr-code-creation-page.component';
import { ShopQrCodeHomeComponent } from './containers/shop-qr-code-home/shop-qr-code-home.component';
import { ShopQRCodeRoutingModule } from './shop-qr-code-routing.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    ShopQrCodeHomeComponent,
    ShopQrCodeMenuComponent,
    ShopQrCodeCreationPageComponent,
    ShopQrCodePrinterComponent,
    ShopQrCodeVisualComponent
  ],
  imports: [
    CommonModule,
    ShopQRCodeRoutingModule,
    SharedComponentsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule,
    ReactiveFormsModule,
    QRCodeModule
  ]
})
export class ShopQrCodeModule {}
