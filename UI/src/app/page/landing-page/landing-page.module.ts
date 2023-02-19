import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { LandingPageBodyComponent } from './components/landing-page-body/landing-page-body.component';
import { LandingPageHeaderComponent } from './components/landing-page-header/landing-page-header.component';
import { LandingPageContainerComponent } from './containers/landing-page-container/landing-page-container.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';

@NgModule({
  declarations: [LandingPageHeaderComponent, LandingPageContainerComponent, LandingPageBodyComponent],
  imports: [CommonModule, LandingPageRoutingModule, SharedComponentsModule]
})
export class LandingPageModule {}
