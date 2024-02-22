import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingHomePageContainerComponent } from './containers/landing-home-page-container/landing-home-page-container.component';
import { LandingPageContainerComponent } from './containers/landing-page-container/landing-page-container.component';
import { PartnershipPageContainerComponent } from './containers/partnership-page-container/partnership-page-container.component';
import { PrivacyPolicyPageContainerComponent } from './containers/privacy-policy-page-container/privacy-policy-page-container.component';
import { TermsAndCondPageContainerComponent } from './containers/terms-and-cond-page-container/terms-and-cond-page-container.component';

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
        path: 'privacy-policy',
        component: PrivacyPolicyPageContainerComponent
      },
      {
        path: 'terms-and-conditions',
        component: TermsAndCondPageContainerComponent
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
