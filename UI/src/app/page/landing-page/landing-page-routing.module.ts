import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BountyPageContainerComponent } from './containers/bounty-page-container/bounty-page-container.component';
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
        title: 'Home',
        path: 'home',
        component: LandingPageContainerComponent
      },
      {
        title: 'Partnership',
        path: 'partnership',
        component: PartnershipPageContainerComponent
      },
      {
        title: 'Privacy Policy',
        path: 'privacy-policy',
        component: PrivacyPolicyPageContainerComponent
      },
      {
        title: 'Terms and Conditions',
        path: 'terms-and-conditions',
        component: TermsAndCondPageContainerComponent
      },
      {
        title: 'Bounty Program',
        path: 'bounty-program',
        component: BountyPageContainerComponent
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
