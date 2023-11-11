import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getBidByTxn } from './../../../../../../store/bid-store/state/actions';

@Component({
  selector: 'app-bid-page',
  templateUrl: './bid-page.component.html',
  styleUrls: ['./bid-page.component.scss']
})
export class BidPageComponent implements OnInit {

  constructor(
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    // this.store.dispatch(getBidByTxn({txn: '0x5fbdb2315678afecb367f032d93f642f64180aa3'}))
  }
}
