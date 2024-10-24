import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { SetupTokenMenuComponent } from './components/setup-token-menu/setup-token-menu.component';
import { TokenCreationFormComponent } from './components/token-creation-form/token-creation-form.component';
import { TokenCreationReviewComponent } from './components/token-creation-review/token-creation-review.component';
import { SetupTokenHomeComponent } from './containers/setup-token-home/setup-token-home.component';
import { TokenCreationPageComponent } from './containers/token-creation-page/token-creation-page.component';
import { TokenManagementPageComponent } from './containers/token-management-page/token-management-page.component';
import { SetUpTokenRoutingModule } from './setup-token-routing.module';
import { TokenSearchPageComponent } from './containers/token-search-page/token-search-page.component';

@NgModule({
  declarations: [
    SetupTokenHomeComponent,
    SetupTokenMenuComponent,
    TokenCreationPageComponent,
    TokenManagementPageComponent,
    TokenCreationFormComponent,
    TokenCreationReviewComponent,
    TokenSearchPageComponent
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
