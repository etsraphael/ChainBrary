import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { CertificationMessageComponent } from './certification-message/certification-message.component';
import { NavBarMobileComponent } from './nav-bar-mobile/nav-bar-mobile.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';

@NgModule({
  declarations: [
    FooterPageComponent,
    HeaderPageComponent,
    CertificationMessageComponent,
    NavBarMobileComponent,
    UserAvatarComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    FooterPageComponent,
    HeaderPageComponent,
    CertificationMessageComponent,
    NavBarMobileComponent,
    UserAvatarComponent
  ]
})
export class SharedComponentsModule {}
