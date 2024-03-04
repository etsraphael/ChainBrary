import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityVaultsHomePageContainerComponent } from './containers/community-vaults-home-page-container/community-vaults-home-page-container.component';
import { CommunityVaultsListPageContainerComponent } from './containers/community-vaults-list-page-container/community-vaults-list-page-container.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityVaultsHomePageContainerComponent,
    children: [
      {
        path: 'list',
        component: CommunityVaultsListPageContainerComponent
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityVaultPageRoutingModule {}
