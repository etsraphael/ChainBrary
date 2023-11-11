import { Component } from '@angular/core';
import { IUseCasesActionCard } from './../../../../../../page/use-cases-page/components/use-cases-action-card/use-cases-action-card.component';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
@Component({
  selector: 'app-home-bid-menu',
  templateUrl: './home-bid-menu.component.html',
  styleUrls: ['./home-bid-menu.component.scss']
})
export class HomeBidMenuComponent {
  headerPayload: IUseCasesHeader = {
    title: 'Bid',
    goBackLink: '/use-cases/services',
    description:
      "Effortlessly initiate and propagate bids among your peers. This feature has been fine-tuned for the network's native tokens, ensuring seamless integration and reliability. Dive into the bidding process with enhanced transparency and full control, while catering to your specific requirements within the network's ecosystem."
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      title: 'Create a bid',
      descritpion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt ultricies mi, vel eleifend eros. Sed placerat volutpat feugiat. In velit ipsum, elementum a felis eget',
      routerLink: '/use-cases/bid/creation',
      buttonText: 'Start creation'
    },
    {
      title: 'Join a bid',
      descritpion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt ultricies mi, vel eleifend eros. Sed placerat volutpat feugiat. In velit ipsum, elementum a felis eget',
      routerLink: '/use-cases/bid/search',
      buttonText: 'Start joining'
    }
  ];
}
