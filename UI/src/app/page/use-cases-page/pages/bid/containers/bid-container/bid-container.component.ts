import { Component } from '@angular/core';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';

@Component({
  selector: 'app-bid-container',
  templateUrl: './bid-container.component.html',
  styleUrls: ['./bid-container.component.scss']
})
export class BidContainerComponent {
  headerPayload: IUseCasesHeader = {
    title: 'Bid',
    description:
      'Effortlessly initiate and propagate bids among your peers. This feature has been fine-tuned for the network\'s native tokens, ensuring seamless integration and reliability. Dive into the bidding process with enhanced transparency and full control, while catering to your specific requirements within the network\'s ecosystem.'
  };

}
