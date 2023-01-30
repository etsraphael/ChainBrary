import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './../../../../store/root-state';
import { AuthStatusCode } from './../../../../shared/enum';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  authStatusCode = AuthStatusCode;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    // get your selectors to know what to display
  }
}
