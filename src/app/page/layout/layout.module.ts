import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@NgModule({
  declarations: [HeaderComponent, SideBarComponent],
  imports: [CommonModule],
  exports: [HeaderComponent, SideBarComponent]
})
export class LayoutModule {}
