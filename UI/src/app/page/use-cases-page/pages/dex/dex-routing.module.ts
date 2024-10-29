import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DexHomePageComponent } from './containers/dex-home-page/dex-home-page.component';

const routes: Routes = [
  {
    path: '',
    component: DexHomePageComponent,
    children: [
      // {
      //   path: 'swap',
      //   component: Component1, // TODO: add swap component
      //   data: { animation: 'bid-services' }
      // },
      // {
      //   path: 'luiquidity',
      //   component: Component2, // TODO: add liquidity component
      //   data: { animation: 'bid-creation' }
      // },
      // {
      //   path: '',
      //   redirectTo: 'swap',
      //   pathMatch: 'full'
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DexRoutingModule {}
