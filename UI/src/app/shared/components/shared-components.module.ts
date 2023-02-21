import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';

@NgModule({
  declarations: [FooterPageComponent, HeaderPageComponent],
  imports: [CommonModule, RouterModule],
  exports: [FooterPageComponent, HeaderPageComponent]
})
export class SharedComponentsModule {}
