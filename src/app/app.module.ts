import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './page/layout/layout.module';
import { RootStateModule } from './store';
import { MaterialModule } from './material/material.module';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, LayoutModule, MaterialModule, RootStateModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
