import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingHomePageContainerComponent } from './containers/landing-home-page-container/landing-home-page-container.component';
import { LandingPageContainerComponent } from './containers/landing-page-container/landing-page-container.component';
import { PartnershipPageContainerComponent } from './containers/partnership-page-container/partnership-page-container.component';

const routes: Routes = [
  {
    path: '',
    component: LandingHomePageContainerComponent,
    children: [
      {
        path: 'home',
        component: LandingPageContainerComponent
      },
      {
        path: 'partnership',
        component: PartnershipPageContainerComponent
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule {}
