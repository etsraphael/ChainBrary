import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { loadAuth } from './store/auth-store/state/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ChainBrary';

  constructor(private store: Store, private apollo: Apollo) {}

  ngOnInit(): void {
    this.store.dispatch(loadAuth());
  }
}
