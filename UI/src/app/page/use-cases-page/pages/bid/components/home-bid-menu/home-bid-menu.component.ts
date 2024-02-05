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
    title: $localize`:@@useCases.bid.title:Bid`,
    goBackLink: '/use-cases/services',
    description: $localize`:@@useCases.bid.description:Effortlessly initiate and propagate bids among your peers. This feature has been fine-tuned for the network's native tokens, ensuring seamless integration and reliability. Dive into the bidding process with enhanced transparency and full control, while catering to your specific requirements within the network's ecosystem.`
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      title: $localize`:@@useCases.bid.createBid:Create a bid`,
      descritpion: $localize`:@@useCases.bid.createBidDescription:Kickstart your bidding process with 'Create a Bid.' Tailor your bid with ease, ensuring a secure and straightforward setup. Ideal for diverse offerings, this feature simplifies launching bids on our decentralized platform.`,
      routerLink: '/use-cases/bid/creation',
      buttonText: 'Start creation'
    },
    {
      title: $localize`:@@useCases.bid.joinBid:Join a bid`,
      descritpion: $localize`:@@useCases.bid.joinBidDescription:Dive into existing bids with 'Join a Bid.' Find and participate in bids that align with your interests. Our platform offers a seamless and secure way to engage with the decentralized bidding community.`,
      routerLink: '/use-cases/bid/search',
      buttonText: 'Start joining'
    }
  ];
}
