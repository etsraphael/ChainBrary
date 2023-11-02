import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './../../../module/material.module';
import { UseCasesHeaderComponent } from './use-cases-header/use-cases-header.component';
import { UseCasesListComponent } from './use-cases-list/use-cases-list.component';
import { UseCasesActionCardComponent } from './use-cases-action-card/use-cases-action-card.component';

@NgModule({
  declarations: [UseCasesListComponent, UseCasesHeaderComponent, UseCasesActionCardComponent],
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  exports: [UseCasesListComponent, UseCasesHeaderComponent, UseCasesActionCardComponent]
})
export class UserCasesSharedComponentsModule {}
