import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { LandingPageBodyComponent } from './components/landing-page-body/landing-page-body.component';
import { LandingPageCardComponent } from './components/landing-page-card/landing-page-card.component';
import { LandingPageHeaderPageComponent } from './components/landing-page-header/landing-page-header.component';
import { LandingHomePageContainerComponent } from './containers/landing-home-page-container/landing-home-page-container.component';
import { LandingPageContainerComponent } from './containers/landing-page-container/landing-page-container.component';
import { PartnershipPageContainerComponent } from './containers/partnership-page-container/partnership-page-container.component';
import { PrivacyPolicyPageContainerComponent } from './containers/privacy-policy-page-container/privacy-policy-page-container.component';
import { TermsAndCondPageContainerComponent } from './containers/terms-and-cond-page-container/terms-and-cond-page-container.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';

@NgModule({
  declarations: [
    LandingPageHeaderPageComponent,
    LandingPageContainerComponent,
    LandingPageBodyComponent,
    PartnershipPageContainerComponent,
    LandingHomePageContainerComponent,
    LandingPageCardComponent,
    PrivacyPolicyPageContainerComponent,
    TermsAndCondPageContainerComponent
  ],
  imports: [CommonModule, LandingPageRoutingModule, SharedComponentsModule, MarkdownModule.forChild()]
})
export class LandingPageModule {}
