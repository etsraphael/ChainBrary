import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { QRCodeModule } from 'angularx-qrcode';
import { MarkdownModule } from 'ngx-markdown';
import { web3LoginConfig } from './../../data/web3LoginConfig.data';
import { MaterialModule } from './../../module/material.module';
import { AuthBannerComponent } from './auth-banner/auth-banner.component';
import { ChainbraryButtonComponent } from './chainbrary-button/chainbrary-button.component';
import { DrawerSidebarComponent } from './drawer-sidebar/drawer-sidebar.component';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { HeaderBodyPageComponent } from './header-body-page/header-body-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { QrCodeContainerModalComponent } from './modal/qr-code-container-modal/qr-code-container-modal.component';
import { QrCodeScanningPageComponent } from './qr-code-scanning-page/qr-code-scanning-page.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { TermAndCondModalComponent } from './term-and-cond-modal/term-and-cond-modal.component';
import { TransactionCardComponent } from './transaction-card/transaction-card.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { LOAD_WASM, NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

// Necessary to solve the problem of losing internet connection
LOAD_WASM().subscribe();

@NgModule({
  declarations: [
    FooterPageComponent,
    HeaderPageComponent,
    UserAvatarComponent,
    TransactionCardComponent,
    ChainbraryButtonComponent,
    QrCodeContainerModalComponent,
    TermAndCondModalComponent,
    HeaderBodyPageComponent,
    AuthBannerComponent,
    LoadingScreenComponent,
    DrawerSidebarComponent,
    ServiceCardComponent,
    QrCodeScanningPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QRCodeModule,
    MaterialModule,
    MarkdownModule.forRoot(),
    NgxScannerQrcodeModule
  ],
  exports: [
    FooterPageComponent,
    HeaderPageComponent,
    UserAvatarComponent,
    TransactionCardComponent,
    ChainbraryButtonComponent,
    QrCodeContainerModalComponent,
    TermAndCondModalComponent,
    HeaderBodyPageComponent,
    AuthBannerComponent,
    LoadingScreenComponent,
    DrawerSidebarComponent,
    ServiceCardComponent,
    QrCodeScanningPageComponent
  ]
})
export class SharedComponentsModule {}

@NgModule({
  imports: [SharedComponentsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
  exports: [SharedComponentsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
  providers: [{ provide: 'config', useValue: web3LoginConfig }]
})
export class SharedTestModule {}
