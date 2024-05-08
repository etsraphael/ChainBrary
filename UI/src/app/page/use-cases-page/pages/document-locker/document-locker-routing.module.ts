import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentLockerMenuComponent } from './component/document-locker-menu/document-locker-menu.component';
import { DocumentLockerFoundComponent } from './containers/document-locker-found/document-locker-found.component';
import { DocumentLockerHomeComponent } from './containers/document-locker-home/document-locker-home.component';
import { DocumentLockerMakerComponent } from './containers/document-locker-maker/document-locker-maker.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentLockerHomeComponent,
    children: [
      {
        path: 'services',
        component: DocumentLockerMenuComponent
      },
      {
        path: 'creation',
        component: DocumentLockerMakerComponent
      },
      {
        path: 'id/:id',
        component: DocumentLockerFoundComponent
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
export class DocumentLockerRoutingModule {}
