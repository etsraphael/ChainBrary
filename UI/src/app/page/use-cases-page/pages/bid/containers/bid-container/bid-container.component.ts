import { Component } from '@angular/core';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import { IUseCasesActionCard } from './../../../../../../page/use-cases-page/components/use-cases-action-card/use-cases-action-card.component';

@Component({
  selector: 'app-bid-container',
  templateUrl: './bid-container.component.html',
  styleUrls: ['./bid-container.component.scss']
})
export class BidContainerComponent {
  headerPayload: IUseCasesHeader = {
    title: 'Bid',
    description:
      "Effortlessly initiate and propagate bids among your peers. This feature has been fine-tuned for the network's native tokens, ensuring seamless integration and reliability. Dive into the bidding process with enhanced transparency and full control, while catering to your specific requirements within the network's ecosystem."
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      title: 'Create a bid',
      descritpion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt ultricies mi, vel eleifend eros. Sed placerat volutpat feugiat. In velit ipsum, elementum a felis eget',
      routerLink: '/use-cases/bid/create-bid',
      buttonText: 'Start creation'
    },
    {
      title: 'Join a bid',
      descritpion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt ultricies mi, vel eleifend eros. Sed placerat volutpat feugiat. In velit ipsum, elementum a felis eget',
      routerLink: '/use-cases/bid/create-bid',
      buttonText: 'Start joining'
    }
  ];
}
