import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UseCasesPageRoutingModule } from '../use-cases-page-routing.module';
import { MaterialModule } from './../../../module/material.module';
import { SharedComponentsModule } from './../../../shared/components/shared-components.module';
import { TransactionActivityHeaderComponent } from './components/transaction-activity-header/transaction-activity-header.component';
import { TransactionActivityTableComponent } from './components/transaction-activity-table/transaction-activity-table.component';
import { ActivityContainerComponent } from './containers/activity-container/activity-container.component';

@NgModule({
  declarations: [ActivityContainerComponent, TransactionActivityHeaderComponent, TransactionActivityTableComponent],
  imports: [CommonModule, SharedComponentsModule, UseCasesPageRoutingModule, MaterialModule]
})
export class ActivityModule {}
