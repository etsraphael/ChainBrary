import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { ShopQrCodeHomeComponent } from './containers/shop-qr-code-home/shop-qr-code-home.component';
import { ShopQRCodeRoutingModule } from './shop-qr-code-routing.module';
import { ShopQrCodeMenuComponent } from './components/shop-qr-code-menu/shop-qr-code-menu.component';

@NgModule({
  declarations: [ShopQrCodeHomeComponent, ShopQrCodeMenuComponent],
  imports: [
    CommonModule,
    ShopQRCodeRoutingModule,
    SharedComponentsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule,
    ReactiveFormsModule
  ]
})
export class ShopQrCodeModule {}
