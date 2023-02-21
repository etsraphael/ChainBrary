import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';

@NgModule({
  declarations: [FooterPageComponent, HeaderPageComponent],
  imports: [CommonModule],
  exports: [FooterPageComponent, HeaderPageComponent]
})
export class SharedComponentsModule {}
