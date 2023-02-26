import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Web3LoginModule } from '@chainbrary/web3-login';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './module/app-routing.module';
import { GraphQLModule } from './module/graphql.module';
import { MaterialModule } from './module/material.module';
import { LandingPageModule } from './page/landing-page/landing-page.module';
import { UseCasesPageModule } from './page/use-cases-page/use-cases-page.module';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { RootStateModule } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    RootStateModule,
    GraphQLModule,
    HttpClientModule,
    Web3LoginModule,
    LandingPageModule,
    SharedComponentsModule,
    UseCasesPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
