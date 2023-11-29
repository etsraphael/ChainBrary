import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidCreationComponent } from './components/bid-creation/bid-creation.component';
import { BidSearchComponent } from './components/bid-search/bid-search.component';
import { HomeBidMenuComponent } from './components/home-bid-menu/home-bid-menu.component';
import { BidContainerComponent } from './containers/bid-container/bid-container.component';
import { BidPageComponent } from './containers/bid-page/bid-page.component';

const routes: Routes = [
  {
    path: '',
    component: BidContainerComponent,
    children: [
      {
        path: 'services',
        component: HomeBidMenuComponent,
        data: { animation: 'bid-services' }
      },
      {
        path: 'creation',
        component: BidCreationComponent,
        data: { animation: 'bid-creation' }
      },
      {
        path: 'search',
        component: BidSearchComponent,
        data: { animation: 'bid-search' }
      },
      {
        path: 'search/:id',
        component: BidPageComponent
      },
      {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidRoutingModule {}
