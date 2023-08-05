import { SideBarRoute } from '../interfaces';

const useCaseRoutes: SideBarRoute[] = [
  {
    title: 'Payment Request',
    path: '/payment-request',
    icon: 'bi-envelope-fill',
    enabled: true
  },
  {
    title: 'Activity',
    path: '/activity',
    icon: 'bi-clipboard-data-fill',
    enabled: true
  }
];

export default useCaseRoutes;
