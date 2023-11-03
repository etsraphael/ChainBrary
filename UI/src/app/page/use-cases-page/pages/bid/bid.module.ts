import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { BidRoutingModule } from './bid-routing.module';
import { HomeBidMenuComponent } from './components/home-bid-menu/home-bid-menu.component';
import { BidContainerComponent } from './containers/bid-container/bid-container.component';

@NgModule({
  declarations: [BidContainerComponent, HomeBidMenuComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    BidRoutingModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule
  ]
})
export class BidModule {}
