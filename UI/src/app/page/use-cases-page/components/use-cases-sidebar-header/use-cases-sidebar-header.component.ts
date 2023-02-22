import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthStatusCode } from './../../../../shared/enum';
import { selectPublicAddress, selectSideBarMode } from './../../../../store/auth-store/state/selectors';
@Component({
  selector: 'app-use-cases-sidebar-header',
  templateUrl: './use-cases-sidebar-header.component.html',
  styleUrls: ['./use-cases-sidebar-header.component.scss']
})
export class UseCasesSidebarHeaderComponent implements OnInit {
  authStatusCodeTypes = AuthStatusCode;
  sidebarMode$: Observable<AuthStatusCode>;
  publicAddress$: Observable<string | null>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.sidebarMode$ = this.store.select(selectSideBarMode);
    this.publicAddress$ = this.store.select(selectPublicAddress);
  }
}
