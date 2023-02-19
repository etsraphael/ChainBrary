import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Web3LoginModule } from '@chainbrary/web3-login';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { MaterialModule } from './material/material.module';
import { LandingPageModule } from './page/landing-page/landing-page.module';
import { LayoutModule } from './page/layout/layout.module';
import { RootStateModule } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MaterialModule,
    RootStateModule,
    GraphQLModule,
    HttpClientModule,
    Web3LoginModule,
    LandingPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
