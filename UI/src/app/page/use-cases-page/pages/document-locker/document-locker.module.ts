import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../../app/module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { DocumentLockerFormComponent } from './component/document-locker-form/document-locker-form.component';
import { DocumentLockerFoundComponent } from './containers/document-locker-found/document-locker-found.component';
import { DocumentLockerHomeComponent } from './containers/document-locker-home/document-locker-home.component';
import { DocumentLockerMakerComponent } from './containers/document-locker-maker/document-locker-maker.component';
import { DocumentLockerMenuComponent } from './component/document-locker-menu/document-locker-menu.component';
import { DocumentLockerRoutingModule } from './document-locker-routing.module';
import { DocumentLockerContentComponent } from './component/document-locker-content/document-locker-content.component';

@NgModule({
  declarations: [
    DocumentLockerHomeComponent,
    DocumentLockerFormComponent,
    DocumentLockerFoundComponent,
    DocumentLockerMakerComponent,
    DocumentLockerMenuComponent,
    DocumentLockerContentComponent
  ],
  imports: [
    CommonModule,
    DocumentLockerRoutingModule,
    SharedComponentsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule,
    ReactiveFormsModule
  ]
})
export class DocumentLockerModule {}
