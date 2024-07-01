import { Component } from '@angular/core';
import { footerListData } from './../../../../data/socialMediaCard.data';
import { IServiceCard } from './../../../../shared/components/service-card/service-card.component';
import { SocialMediaCardItem } from './../../../../shared/interfaces';

@Component({
  selector: 'app-landing-page-body',
  templateUrl: './landing-page-body.component.html',
  styleUrls: ['./landing-page-body.component.scss']
})
export class LandingPageBodyComponent {
  socialMediaList: SocialMediaCardItem[] = footerListData;

  cards: IServiceCard[] = [
    {
      id: 'payment-request',
      title: $localize`:@@landingPage.paymentServiceTitle:Payment Request`,
      description: $localize`:@@landingPage.paymentServiceDesc:Connect you wallet, Create an ID or QRcode and use it to receive payments.`,
      img: 'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/payment-service.svg',
      routerUrl: './../../use-cases/payment-request'
    },
    {
      id: 'bid',
      title: $localize`:@@landingPage.bidServiceTitle:Start a Bid`,
      description: $localize`:@@landingPage.bidServiceDesc:Upload an item, set time limit and start bidding with tokens.`,
      img: 'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/bid-service.svg',
      routerUrl: './../../use-cases/bid/services'
    },
    {
      id: 'document-locker',
      title: $localize`:@@landingPage.documentLockerTitle:Document Locker`,
      description: $localize`:@@landingPage.documentLockerDesc:Lock confidential information and open only with tokens.`,
      img: 'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/document-service.svg',
      routerUrl: './../../use-cases/document-locker/services'
    }
  ];
}
