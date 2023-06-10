import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { NavBarMobileComponent } from './nav-bar-mobile/nav-bar-mobile.component';
import { TransactionCardComponent } from './transaction-card/transaction-card.component';
import { UseCasesSidebarHeaderComponent } from './use-cases-sidebar-header/use-cases-sidebar-header.component';
import { UseCasesSidebarComponent } from './use-cases-sidebar/use-cases-sidebar.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ChainbraryButtonComponent } from './chainbrary-button/chainbrary-button.component';
import { QrCodeContainerModalComponent } from './modal/qr-code-container-modal/qr-code-container-modal.component';

@NgModule({
  declarations: [
    FooterPageComponent,
    HeaderPageComponent,
    NavBarMobileComponent,
    UserAvatarComponent,
    UseCasesSidebarHeaderComponent,
    UseCasesSidebarComponent,
    TransactionCardComponent,
    ChainbraryButtonComponent,
    QrCodeContainerModalComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    FooterPageComponent,
    HeaderPageComponent,
    NavBarMobileComponent,
    UserAvatarComponent,
    UseCasesSidebarHeaderComponent,
    UseCasesSidebarComponent,
    TransactionCardComponent,
    ChainbraryButtonComponent,
    QrCodeContainerModalComponent
  ]
})
export class SharedComponentsModule {}
