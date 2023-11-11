import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IUseCasesHeader } from './../../../../../..//page/use-cases-page/components/use-cases-header/use-cases-header.component';

@Component({
  selector: 'app-bid-page',
  templateUrl: './bid-page.component.html',
  styleUrls: ['./bid-page.component.scss']
})
export class BidPageComponent {
  headerPayload: IUseCasesHeader = {
    title: 'Saint Albans House - 2 Bed Flat',
    goBackLink: null,
    description: null
  };

  constructor(private readonly store: Store) {}

  // ngOnInit(): void {
  //   // this.store.dispatch(getBidByTxn({txn: '0x5fbdb2315678afecb367f032d93f642f64180aa3'}))
  // }
}
