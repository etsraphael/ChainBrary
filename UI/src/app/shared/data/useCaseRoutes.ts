import { IServiceCard } from "../components/service-card/service-card.component";

const serviceCards: IServiceCard[] = [
  {
    title: $localize`:@@landingPage.paymentServiceTitle:Payment Request`,
    description: $localize`:@@landingPage.paymentServiceDesc:Connect you wallet, Create an ID or QRcode and use it to receive payments.`,
    img: './../../../../assets/bg/light/payment-service.svg',
    routerUrl: './../../use-cases/payment-request'
  },
  {
    title: $localize`:@@landingPage.bidServiceTitle:Start a Bid`,
    description: $localize`:@@landingPage.bidServiceDesc:Upload an item, set time limit and start bidding with tokens.`,
    img: './../../../../assets/bg/light/bid-service.svg',
    routerUrl: './../../use-cases/bid/services'
  },
  {
    title: $localize`:@@landingPage.documentLockerTitle:Document Locker`,
    description: $localize`:@@landingPage.documentLockerDesc:Lock confidential information and open only with tokens.`,
    img: './../../../../assets/bg/light/document-service.svg',
    routerUrl: './../../use-cases/document-locker/services'
  }
];

export default serviceCards;
