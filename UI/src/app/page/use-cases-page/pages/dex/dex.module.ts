import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '../../../../module/material.module';
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { DexHomePageComponent } from './containers/dex-home-page/dex-home-page.component';
import { DexLiquidityPageComponent } from './containers/dex-liquidity-page/dex-liquidity-page.component';
import { DexSwappingPageComponent } from './containers/dex-swapping-page/dex-swapping-page.component';
import { DexRoutingModule } from './dex-routing.module';

@NgModule({
  declarations: [DexHomePageComponent, DexSwappingPageComponent, DexLiquidityPageComponent],
  imports: [
    CommonModule,
    DexRoutingModule,
    SharedComponentsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule,
    ReactiveFormsModule
  ]
})
export class DexModule {}
