import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { SetupTokenMenuComponent } from './components/setup-token-menu/setup-token-menu.component';
import { TokenCreationFormComponent } from './components/token-creation-form/token-creation-form.component';
import { TokenCreationModalComponent } from './components/token-creation-modal/token-creation-modal.component';
import { TokenCreationReviewComponent } from './components/token-creation-review/token-creation-review.component';
import { SetupTokenHomeComponent } from './containers/setup-token-home/setup-token-home.component';
import { TokenCreationPageComponent } from './containers/token-creation-page/token-creation-page.component';
import { TokenManagementPageComponent } from './containers/token-management-page/token-management-page.component';
import { SetUpTokenRoutingModule } from './setup-token-routing.module';

@NgModule({
  declarations: [
    SetupTokenHomeComponent,
    SetupTokenMenuComponent,
    TokenCreationPageComponent,
    TokenManagementPageComponent,
    TokenCreationModalComponent,
    TokenCreationFormComponent,
    TokenCreationReviewComponent
  ],
  imports: [
    CommonModule,
    SetUpTokenRoutingModule,
    SharedComponentsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule,
    ReactiveFormsModule
  ]
})
export class SetupTokenModule {}
