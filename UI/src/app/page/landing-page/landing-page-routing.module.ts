import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageContainerComponent } from './containers/landing-page-container/landing-page-container.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageContainerComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule {}
