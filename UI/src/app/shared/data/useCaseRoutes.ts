import { SideBarRoute } from '../interfaces';

const useCaseRoutes: SideBarRoute[] = [
  {
    title: 'Payment Request',
    path: '/payment-request',
    icon: 'bi-envelope-fill',
    enabled: true
  },
  {
    title: 'Certification',
    path: '/certification',
    icon: 'bi-patch-check-fill',
    enabled: false
  }
];

export default useCaseRoutes;
