import { Component } from '@angular/core';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';

@Component({
  selector: 'app-bid-search',
  templateUrl: './bid-search.component.html',
  styleUrls: ['./bid-search.component.scss']
})
export class BidSearchComponent {
  headerPayload: IUseCasesHeader = {
    title: 'Join a bid',
    goBackLink: '/use-cases/bid/services',
    description: null
  };
}
