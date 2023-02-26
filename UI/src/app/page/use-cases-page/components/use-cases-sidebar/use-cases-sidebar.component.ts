import { Component } from '@angular/core';
import useCaseRoutes from './../../../../shared/data/useCaseRoutes';
import { SideBarRoute } from './../../../../shared/interfaces';

@Component({
  selector: 'app-use-cases-sidebar',
  templateUrl: './use-cases-sidebar.component.html',
  styleUrls: ['./use-cases-sidebar.component.scss']
})
export class UseCasesSidebarComponent {
  useCaseRoutes: SideBarRoute[] = useCaseRoutes;
}
