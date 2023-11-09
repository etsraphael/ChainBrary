import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getBidByTxn } from './../../../../../../store/bid-store/state/actions';

@Component({
  selector: 'app-bid-search',
  templateUrl: './bid-search.component.html',
  styleUrls: ['./bid-search.component.scss']
})
export class BidSearchComponent implements OnInit {

  constructor(
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getBidByTxn({txn: '0x5fbdb2315678afecb367f032d93f642f64180aa3'}))
  }
}
