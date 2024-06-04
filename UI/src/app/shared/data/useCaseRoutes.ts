import { IServiceCard } from '../components/service-card/service-card.component';

const serviceCards: IServiceCard[] = [
  {
    id: 'payment-request',
    title: $localize`:@@landingPage.paymentServiceTitle:Payment Request`,
    description: $localize`:@@landingPage.paymentServiceDesc:Connect you wallet, Create an ID or QRcode and use it to receive payments.`,
    img: './../../../../assets/bg/light/payment-service.svg',
    routerUrl: './../../use-cases/payment-request'
  },
  {
    id: 'bid',
    title: $localize`:@@landingPage.bidServiceTitle:Start a Bid`,
    description: $localize`:@@landingPage.bidServiceDesc:Upload an item, set time limit and start bidding with tokens.`,
    img: './../../../../assets/bg/light/bid-service.svg',
    routerUrl: './../../use-cases/bid/services'
  },
  {
    id: 'document-locker',
    title: $localize`:@@landingPage.documentLockerTitle:Document Locker`,
    description: $localize`:@@landingPage.documentLockerDesc:Lock confidential information and open only with tokens.`,
    img: './../../../../assets/bg/light/document-service.svg',
    routerUrl: './../../use-cases/document-locker/services'
  },
  {
    id: 'shop-qr-code',
    title: $localize`:@@landingPage.myQRCodeTitle:My QR Code`,
    description: $localize`:@@landingPage.myQRCodeDesc:Print a QR code for your business and let your customers pay in Cryptos.`,
    img: './../../../../assets/services/qr-code-shop.svg',
    routerUrl: './../../use-cases/shop-qr-code/services'
  },
  {
    id: 'shop-qr-code',
    title: $localize`:@@servicePage.payTogetherServiceTitle:Pay Together`,
    description: $localize`:@@servicePage.payTogetherServiceDesc: Create a payment link and share it with your friends to pay together.`,
    img: './../../../../assets/services/pay-together-0.svg',
    routerUrl: null,
    isDisabled: true
  },
  {
    id: 'anonymous-vote',
    title: $localize`:@@servicePage.anonymousVoteServiceTitle:Anonymous Vote`,
    description: $localize`:@@servicePage.anonymousVoteServiceDesc:Create a vote and share it with your friends to vote anonymously`,
    img: './../../../../assets/services/anonymous-vote.svg',
    routerUrl: null,
    isDisabled: true
  },
  {
    id: 'create-token',
    title: $localize`:@@servicePage.createTokenServiceTitle: Create Token`,
    description: $localize`:@@servicePage.createTokenServiceDesc: Create a token and share it with your friends to use it as a currency.`,
    img: './../../../../assets/services/token-creation.svg',
    routerUrl: null,
    isDisabled: true
  },
  {
    id: 'network-bridge',
    title: $localize`:@@servicePage.networkBridgeServiceTitle: Network Bridge`,
    description: $localize`:@@servicePage.networkBridgeServiceDesc: Connect two different networks and transfer tokens between them.`,
    img: './../../../../assets/services/swap-bridge.svg',
    routerUrl: null,
    isDisabled: true
  },
  {
    id: 'swap-token',
    title: $localize`:@@servicePage.tokenSwapServiceTitle: Token Swap`,
    description: $localize`:@@servicePage.tokenSwapServiceDesc: Swap tokens for another token on the same network.`,
    img: './../../../../assets/services/swap-token.svg',
    routerUrl: null,
    isDisabled: true
  }
];

export default serviceCards;
