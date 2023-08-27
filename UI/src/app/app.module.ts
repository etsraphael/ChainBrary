import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Web3LoginModule } from '@chainbrary/web3-login';
import * as Sentry from '@sentry/angular-ivy';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './module/app-routing.module';
import { GraphQLModule } from './module/graphql.module';
import { MaterialModule } from './module/material.module';
import { LandingPageModule } from './page/landing-page/landing-page.module';
import { UseCasesPageModule } from './page/use-cases-page/use-cases-page.module';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { RootStateModule } from './store';
import { web3LoginConfig } from './data/web3LoginConfig.data';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    RootStateModule,
    GraphQLModule,
    HttpClientModule,
    Web3LoginModule.forRoot(web3LoginConfig),
    LandingPageModule,
    SharedComponentsModule,
    UseCasesPageModule,
    NgxSkeletonLoaderModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false
      })
    },
    {
      provide: Sentry.TraceService,
      deps: [Router]
    },
    {
      provide: APP_INITIALIZER,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
