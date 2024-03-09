import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectShortBalance } from './../../../../store/auth-store/state/selectors';

@Component({
  selector: 'app-add-token-card',
  templateUrl: './add-token-card.component.html',
  styleUrls: ['./add-token-card.component.scss']
})
export class AddTokenCardComponent {
  constructor(private readonly store: Store) {}

  userBalance$ = this.store.select(selectShortBalance);
}
