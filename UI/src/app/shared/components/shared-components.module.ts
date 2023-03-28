import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CertificationMessageComponent } from './certification-message/certification-message.component';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { NavBarMobileComponent } from './nav-bar-mobile/nav-bar-mobile.component';
import { UseCasesSidebarHeaderComponent } from './use-cases-sidebar-header/use-cases-sidebar-header.component';
import { UseCasesSidebarComponent } from './use-cases-sidebar/use-cases-sidebar.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { TransactionCardComponent } from './transaction-card/transaction-card.component';

@NgModule({
  declarations: [
    FooterPageComponent,
    HeaderPageComponent,
    CertificationMessageComponent,
    NavBarMobileComponent,
    UserAvatarComponent,
    UseCasesSidebarHeaderComponent,
    UseCasesSidebarComponent,
    TransactionCardComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    FooterPageComponent,
    HeaderPageComponent,
    CertificationMessageComponent,
    NavBarMobileComponent,
    UserAvatarComponent,
    UseCasesSidebarHeaderComponent,
    UseCasesSidebarComponent,
    TransactionCardComponent
  ]
})
export class SharedComponentsModule {}
