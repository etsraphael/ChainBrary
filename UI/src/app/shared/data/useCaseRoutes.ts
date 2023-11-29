import { ServiceItemMenu } from '../interfaces';

const useCaseRoutes: ServiceItemMenu[] = [
  {
    title: 'Payment Request',
    path: '/payment-request',
    icon: 'bi-credit-card-2-back',
    enabled: true,
    description: 'Share payment requests fast and safely via link/QR code'
  },
  {
    title: 'Transaction history',
    path: '/activity',
    icon: 'bi-activity',
    enabled: true,
    description: 'Track all your past transactions in one consolidated view'
  },
  {
    title: 'Start a bid',
    path: '/bid',
    icon: 'bi-alarm',
    enabled: true,
    description: 'Easily manage transparent bids with complete control'
  },
  {
    title: 'Pay as a group',
    path: '/',
    icon: 'bi-people-fill',
    enabled: false,
    description: 'Facilitate group payments easily, ideal for shared expenses and gifts'
  }
];

export default useCaseRoutes;
