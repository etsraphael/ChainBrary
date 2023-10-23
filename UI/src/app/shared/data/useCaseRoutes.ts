import { ServiceItemMenu } from '../interfaces';

const useCaseRoutes: ServiceItemMenu[] = [
  {
    title: 'Payment Request',
    path: '/payment-request',
    icon: 'bi-credit-card-2-back',
    enabled: true,
    description: 'Create a payment request, a share quickly the link or the QR Code of your payment to somebody else'
  },
  {
    title: 'Transaction history',
    path: '/activity',
    icon: 'bi-activity',
    enabled: true,
    description: 'Create a payment request, a share quickly the link or the QR Code of your payment to somebody else'
  },
  {
    title: 'Pay as a group',
    path: '/activity',
    icon: 'bi-people-fill',
    enabled: false,
    description: 'Create a payment request, a share quickly the link or the QR Code of your payment to somebody else'
  },
  {
    title: 'Start a bid',
    path: '/activity',
    icon: 'bi-alarm',
    enabled: false,
    description: 'Create a payment request, a share quickly the link or the QR Code of your payment to somebody else'
  }
];

export default useCaseRoutes;
