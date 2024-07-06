import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupTokenMenuComponent } from './components/setup-token-menu/setup-token-menu.component';
import { SetupTokenHomeComponent } from './containers/setup-token-home/setup-token-home.component';

const routes: Routes = [
  {
    path: '',
    component: SetupTokenHomeComponent,
    children: [
      {
        path: 'services',
        component: SetupTokenMenuComponent
      },
      // {
      //   path: 'token-creation',
      //   component: SetUpTokenCreationPageComponent
      // },
      // {
      //   path: 'manage-token',
      //   component: SetUpTokenCreationPageComponent
      // },
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
