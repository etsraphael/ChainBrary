import { SideBarRoute } from '../interfaces';

const useCaseRoutes: SideBarRoute[] = [
  {
    title: 'Payment Request',
    path: '/payment-request',
    icon: 'bi-envelope-fill',
    enabled: true
  },
  {
    title: 'Proposal',
    path: '/certification',
    icon: 'bi-inboxes-fill',
    enabled: false
  }
];

export default useCaseRoutes;
