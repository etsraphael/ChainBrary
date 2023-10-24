import { ServiceItemMenu } from '../interfaces';

const useCaseRoutes: ServiceItemMenu[] = [
  {
    title: 'Payment Request',
    path: '/payment-request',
    icon: 'bi-credit-card-2-back',
    enabled: true,
    description: 'Generate and share payment requests via link or QR Code swiftly and securely'
  },
  {
    title: 'Transaction history',
    path: '/activity',
    icon: 'bi-activity',
    enabled: true,
    description: 'Track your transaction records accurately and conveniently in one place'
  },
  {
    title: 'Pay as a group',
    path: '/',
    icon: 'bi-people-fill',
    enabled: false,
    description: 'Facilitate group payments easily, ideal for shared expenses and gifts'
  },
  {
    title: 'Start a bid',
    path: '/',
    icon: 'bi-alarm',
    enabled: false,
    description: 'Launch and manage bidding effortlessly with full control and transparency.'
  }
];

export default useCaseRoutes;
