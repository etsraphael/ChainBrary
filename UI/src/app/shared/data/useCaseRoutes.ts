import { ServiceItemMenu } from '../interfaces';

const useCaseRoutes: ServiceItemMenu[] = [
  {
    title: $localize`:@@servicePage.sharePaymentTitle:Share Payment`,
    path: '/payment-request',
    icon: 'bi-credit-card-2-back',
    enabled: true,
    description: $localize`:@@servicePage.sharePaymentDesc:Share payment requests fast and safely via link/QR code`
  },
  {
    title: $localize`:@@servicePage.startABidTitle:Start a Bid`,
    path: '/bid',
    icon: 'bi-alarm',
    enabled: true,
    description: $localize`:@@servicePage.startABidDesc: Easily manage transparent bids with complete control`
  },
  {
    title: $localize`:@@servicePage.documentLockerTitle:Document Locker`,
    path: '/document-locker',
    icon: 'bi-file-lock',
    enabled: true,
    description: $localize`:@@servicePage.documentLockerDesc:Securely store and share documents with anyone`
  },
  {
    title: $localize`:@@servicePage.PayTogetherTitle:Pay Together`,
    path: '/',
    icon: 'bi-people-fill',
    enabled: false,
    description: $localize`:@@servicePage.PayTogetherDesc:Facilitate group payments easily, ideal for shared expenses and gifts`
  }
];

export default useCaseRoutes;
