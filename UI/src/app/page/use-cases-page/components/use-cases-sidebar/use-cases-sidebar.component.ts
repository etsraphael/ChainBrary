import { Component } from '@angular/core';

@Component({
  selector: 'app-use-cases-sidebar',
  templateUrl: './use-cases-sidebar.component.html',
  styleUrls: ['./use-cases-sidebar.component.scss']
})
export class UseCasesSidebarComponent {
  useCaseRoutes: UseCaseRoute[] = [
    {
      title: 'Payment Request',
      path: '/payment-request',
      icon: 'bi-envelope-fill'
    },
    {
      title: 'Certification',
      path: '/certification',
      icon: 'bi-patch-check-fill'
    }
  ];
}

export interface UseCaseRoute {
  title: string;
  path: string;
  icon: string;
}
