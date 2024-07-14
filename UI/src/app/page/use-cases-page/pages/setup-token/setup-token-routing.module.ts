import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupTokenMenuComponent } from './components/setup-token-menu/setup-token-menu.component';
import { SetupTokenHomeComponent } from './containers/setup-token-home/setup-token-home.component';
import { TokenCreationPageComponent } from './containers/token-creation-page/token-creation-page.component';
import { TokenManagementPageComponent } from './containers/token-management-page/token-management-page.component';

const routes: Routes = [
  {
    path: '',
    component: SetupTokenHomeComponent,
    children: [
      {
        path: 'services',
        component: SetupTokenMenuComponent
      },
      {
        path: 'token-creation',
        component: TokenCreationPageComponent
      },
      {
        path: 'manage-token/:chainId/:txnHash',
        component: TokenManagementPageComponent
      },
      {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetUpTokenRoutingModule {}
