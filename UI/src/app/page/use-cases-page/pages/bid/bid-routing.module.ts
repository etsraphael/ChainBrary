import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeBidMenuComponent } from './components/home-bid-menu/home-bid-menu.component';
import { BidContainerComponent } from './containers/bid-container/bid-container.component';

const routes: Routes = [
  {
    path: '',
    component: BidContainerComponent,
    children: [
      {
        path: 'services',
        component: HomeBidMenuComponent
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
