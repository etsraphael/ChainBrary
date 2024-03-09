import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';
import { FullAndShortNumber } from './../../../../shared/interfaces';
import { selectBalance } from './../../../../store/auth-store/state/selectors';

@Component({
  selector: 'app-add-token-page-container',
  templateUrl: './add-token-page-container.component.html',
  styleUrls: ['./add-token-page-container.component.scss']
})
export class AddTokenPageContainerComponent {
  headerPayload: IHeaderBodyPage = {
    title: `Community Vault`,
    goBackLink: '/community-vaults/list',
    description: null
  };

  constructor(private readonly store: Store) {}

  readonly userBalance$: Observable<FullAndShortNumber | null> = this.store.select(selectBalance);
}
