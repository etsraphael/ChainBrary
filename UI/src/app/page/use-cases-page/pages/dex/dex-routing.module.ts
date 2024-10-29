import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DexHomePageComponent } from './containers/dex-home-page/dex-home-page.component';
import { DexSwappingPageComponent } from './containers/dex-swapping-page/dex-swapping-page.component';
import { DexLiquidityPageComponent } from './containers/dex-liquidity-page/dex-liquidity-page.component';

const routes: Routes = [
  {
    path: '',
    component: DexHomePageComponent,
    children: [
      {
        path: 'swap',
        component: DexSwappingPageComponent
      },
      {
        path: 'liquidity',
        component: DexLiquidityPageComponent
      },
      {
        path: '',
        redirectTo: 'swap',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DexRoutingModule {}
