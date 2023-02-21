import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../page/landing-page/landing-page.module').then((m) => m.LandingPageModule)
  },
  {
    path: 'use-cases',
    loadChildren: () => import('../page/use-cases-page/use-cases-page.module').then((m) => m.UseCasesPageModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
