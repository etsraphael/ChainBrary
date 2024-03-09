import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from './../../module/material.module';
import { SharedComponentsModule } from './../../shared/components/shared-components.module';
import { CommunityVaultPageRoutingModule } from './community-vaults-page-routing.module';
import { AddTokenCardComponent } from './components/add-token-card/add-token-card.component';
import { CommunityVaultCardComponent } from './components/community-vault-card/community-vault-card.component';
import { CommunityVaultsListComponent } from './components/community-vaults-list/community-vaults-list.component';
import { AddTokenPageContainerComponent } from './containers/add-token-page-container/add-token-page-container.component';
import { CommunityVaultsHomePageContainerComponent } from './containers/community-vaults-home-page-container/community-vaults-home-page-container.component';
import { CommunityVaultsListPageContainerComponent } from './containers/community-vaults-list-page-container/community-vaults-list-page-container.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommunityVaultsHomePageContainerComponent,
    CommunityVaultsListComponent,
    CommunityVaultsListPageContainerComponent,
    CommunityVaultCardComponent,
    AddTokenPageContainerComponent,
    AddTokenCardComponent
  ],
  imports: [
    CommonModule,
    CommunityVaultPageRoutingModule,
    SharedComponentsModule,
    MarkdownModule.forChild(),
    NgxSkeletonLoaderModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class CommunityVaultsPageModule {}
