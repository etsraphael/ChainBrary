import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';
import { StoreState, Vault } from './../../../../shared/interfaces';
import { loadVaults } from './../../../../store/vaults-store/state/actions';
import { selectVaults } from './../../../../store/vaults-store/state/selectors';

@Component({
  selector: 'app-community-vaults-list-page-container',
  templateUrl: './community-vaults-list-page-container.component.html',
  styleUrls: ['./community-vaults-list-page-container.component.scss']
})
export class CommunityVaultsListPageContainerComponent implements OnInit {
  headerPayload: IHeaderBodyPage = {
    title: `Community Vault`,
    goBackLink: null,
    description: `Community Vault mechanism, a cornerstone feature of the Chainbrary ecosystem. It intricately details how the Community Vault functions as a dynamic system for distributing rewards, ensuring that each member's contribution to the network is recognized and fairly compensated.`
  };

  constructor(private readonly store: Store) {}

  communityVaults$: Observable<StoreState<Vault | null>[]> = this.store.select(selectVaults);

  ngOnInit(): void {
    this.store.dispatch(loadVaults());
  }
}
