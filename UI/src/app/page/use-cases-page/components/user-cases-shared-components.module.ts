import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from './../../../module/material.module';
import { SharedComponentsModule } from './../../../shared/components/shared-components.module';
import { UploadImgModalComponent } from './upload-img-modal/upload-img-modal.component';
import { UseCasesActionCardComponent } from './use-cases-action-card/use-cases-action-card.component';
import { UseCasesListComponent } from './use-cases-list/use-cases-list.component';

@NgModule({
  declarations: [UseCasesListComponent, UseCasesActionCardComponent, UploadImgModalComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forChild()
  ],
  exports: [UseCasesListComponent, UseCasesActionCardComponent]
})
export class UserCasesSharedComponentsModule {}
