import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationContainerComponent } from './containers/certification-container/certification-container.component';
import { CertificationEditCardComponent } from './components/certification-edit-card/certification-edit-card.component';
import { MaterialModule } from './../../../module/material.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CertificationContainerComponent, CertificationEditCardComponent],
  imports: [CommonModule, MaterialModule, SharedComponentsModule, ReactiveFormsModule]
})
export class CertificationModule {}
