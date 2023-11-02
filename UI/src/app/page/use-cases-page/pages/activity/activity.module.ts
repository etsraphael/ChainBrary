import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { UseCasesPageRoutingModule } from '../../use-cases-page-routing.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { TransactionActivityTableComponent } from './components/transaction-activity-table/transaction-activity-table.component';
import { ActivityContainerComponent } from './containers/activity-container/activity-container.component';

@NgModule({
  declarations: [ActivityContainerComponent, TransactionActivityTableComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    UseCasesPageRoutingModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule
  ]
})
export class ActivityModule {}
