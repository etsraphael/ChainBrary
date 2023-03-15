import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadAuth } from './store/auth-store/state/actions';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private store: Store) {
    this.store.dispatch(loadAuth());
  }
}
