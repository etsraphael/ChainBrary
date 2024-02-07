import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { LandingPageBodyComponent } from './components/landing-page-body/landing-page-body.component';
import { LandingPageHeaderPageComponent } from './components/landing-page-header/landing-page-header.component';
import { LandingPageContainerComponent } from './containers/landing-page-container/landing-page-container.component';
import { PartnershipPageContainerComponent } from './containers/partnership-page-container/partnership-page-container.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingHomePageContainerComponent } from './containers/landing-home-page-container/landing-home-page-container.component';

@NgModule({
  declarations: [
    LandingPageHeaderPageComponent,
    LandingPageContainerComponent,
    LandingPageBodyComponent,
    PartnershipPageContainerComponent,
    LandingHomePageContainerComponent
  ],
  imports: [CommonModule, LandingPageRoutingModule, SharedComponentsModule]
})
export class LandingPageModule {}
