import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { QRCodeModule } from 'angularx-qrcode';
import { web3LoginConfig } from './../../data/web3LoginConfig.data';
import { MaterialModule } from './../../module/material.module';
import { ChainbraryButtonComponent } from './chainbrary-button/chainbrary-button.component';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { QrCodeContainerModalComponent } from './modal/qr-code-container-modal/qr-code-container-modal.component';
import { TransactionCardComponent } from './transaction-card/transaction-card.component';
import { UseCasesSidebarHeaderComponent } from './use-cases-sidebar-header/use-cases-sidebar-header.component';
import { UseCasesSidebarComponent } from './use-cases-sidebar/use-cases-sidebar.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    FooterPageComponent,
    HeaderPageComponent,
    UserAvatarComponent,
    UseCasesSidebarHeaderComponent,
    UseCasesSidebarComponent,
    TransactionCardComponent,
    ChainbraryButtonComponent,
    QrCodeContainerModalComponent
  ],
  imports: [CommonModule, RouterModule, QRCodeModule, MaterialModule, MarkdownModule.forRoot()],
  exports: [
    FooterPageComponent,
    HeaderPageComponent,
    UserAvatarComponent,
    UseCasesSidebarHeaderComponent,
    UseCasesSidebarComponent,
    TransactionCardComponent,
    ChainbraryButtonComponent,
    QrCodeContainerModalComponent
  ]
})
export class SharedComponentsModule {}

@NgModule({
  imports: [SharedComponentsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
  exports: [SharedComponentsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
  providers: [{ provide: 'config', useValue: web3LoginConfig }]
})
export class SharedTestModule {}
