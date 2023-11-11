import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserCasesSharedComponentsModule } from '../../components/user-cases-shared-components.module';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { BidRoutingModule } from './bid-routing.module';
import { BidCreationComponent } from './components/bid-creation/bid-creation.component';
import { BidSearchComponent } from './components/bid-search/bid-search.component';
import { HomeBidMenuComponent } from './components/home-bid-menu/home-bid-menu.component';
import { BidContainerComponent } from './containers/bid-container/bid-container.component';
import { BidPageComponent } from './containers/bid-page/bid-page.component';

@NgModule({
  declarations: [
    BidContainerComponent,
    HomeBidMenuComponent,
    BidCreationComponent,
    BidSearchComponent,
    BidPageComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    BidRoutingModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    UserCasesSharedComponentsModule,
    ReactiveFormsModule
  ]
})
export class BidModule {}
