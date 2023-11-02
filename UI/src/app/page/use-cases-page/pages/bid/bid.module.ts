import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { UseCasesPageRoutingModule } from '../../use-cases-page-routing.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { BidContainerComponent } from './containers/bid-container/bid-container.component';

@NgModule({
  declarations: [BidContainerComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    UseCasesPageRoutingModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule
  ]
})
export class BidModule {}
