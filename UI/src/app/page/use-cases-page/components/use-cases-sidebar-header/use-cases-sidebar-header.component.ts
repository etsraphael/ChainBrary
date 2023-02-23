import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthStatusCode } from './../../../../shared/enum';
import { IProfileAdded } from './../../../../shared/interfaces';
import { FormatService } from './../../../../shared/services/format/format.service';
import { selectAccount, selectPublicAddress, selectSideBarMode } from './../../../../store/auth-store/state/selectors';
@Component({
  selector: 'app-use-cases-sidebar-header',
  templateUrl: './use-cases-sidebar-header.component.html',
  styleUrls: ['./use-cases-sidebar-header.component.scss']
})
export class UseCasesSidebarHeaderComponent implements OnInit {
  authStatusCodeTypes = AuthStatusCode;
  sidebarMode$: Observable<AuthStatusCode>;
  publicAddress$: Observable<string | null>;
  verifiedAccount$: Observable<IProfileAdded | null>;

  constructor(private store: Store, public formatService: FormatService) {}

  ngOnInit(): void {
    this.sidebarMode$ = this.store.select(selectSideBarMode);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.verifiedAccount$ = this.store.select(selectAccount);

    this.verifiedAccount$.subscribe(console.log);
  }
}
