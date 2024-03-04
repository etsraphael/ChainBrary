import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { SharedComponentsModule } from './../../shared/components/shared-components.module';
import { CommunityVaultPageRoutingModule } from './community-vaults-page-routing.module';
import { CommunityVaultsHeaderComponent } from './components/community-vaults-header/community-vaults-header.component';
import { CommunityVaultsListComponent } from './components/community-vaults-list/community-vaults-list.component';
import { CommunityVaultsHomePageContainerComponent } from './containers/community-vaults-home-page-container/community-vaults-home-page-container.component';
import { CommunityVaultsListPageContainerComponent } from './containers/community-vaults-list-page-container/community-vaults-list-page-container.component';

@NgModule({
  declarations: [
    CommunityVaultsHomePageContainerComponent,
    CommunityVaultsHeaderComponent,
    CommunityVaultsListComponent,
    CommunityVaultsListPageContainerComponent
  ],
  imports: [CommonModule, CommunityVaultPageRoutingModule, SharedComponentsModule, MarkdownModule.forChild()]
})
export class CommunityVaultsPageModule {}
