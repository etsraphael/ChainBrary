import { Component } from '@angular/core';
import { IServiceCard } from './../../../../shared/components/service-card/service-card.component';

@Component({
  selector: 'app-landing-page-body',
  templateUrl: './landing-page-body.component.html',
  styleUrls: ['./landing-page-body.component.scss']
})
export class LandingPageBodyComponent {
  cards: IServiceCard[] = [
    {
      title: $localize`:@@landingPage.paymentServiceTitle:Payment Request`,
      description: $localize`:@@landingPage.paymentServiceDesc:Connect you wallet, Create an ID or QRcode and use it to receive payments.`,
      img: './../../../../assets/bg/light/payment-service.svg'
    },
    {
      title: $localize`:@@landingPage.bidServiceTitle:Start a Bid`,
      description: $localize`:@@landingPage.bidServiceDesc:Upload an item, set time limit and start bidding with tokens.`,
      img: './../../../../assets/bg/light/bid-service.svg'
    },
    {
      title: $localize`:@@landingPage.documentLockerTitle:Document Locker`,
      description: $localize`:@@landingPage.documentLockerDesc:Lock confidential information and open only with tokens.`,
      img: './../../../../assets/bg/light/document-service.svg'
    }
  ];
}
