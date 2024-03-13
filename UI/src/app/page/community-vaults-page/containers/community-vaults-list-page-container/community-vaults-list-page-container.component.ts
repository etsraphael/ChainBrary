import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, mergeMap, take } from 'rxjs';
import { selectRecentTransactionsByComponent } from 'src/app/store/transaction-store/state/selectors';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';
import { ITransactionCard, StoreState, Vault } from './../../../../shared/interfaces';
import { loadVaults } from './../../../../store/vaults-store/state/actions';
import { selectIsVaultsLoaded, selectVaults } from './../../../../store/vaults-store/state/selectors';

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
  isVaultsLoaded$: Observable<boolean> = this.store.select(selectIsVaultsLoaded);
  readonly transactionCards$: Observable<ITransactionCard[]> = this.store.select(
    selectRecentTransactionsByComponent('CommunityVaultsListPageContainerComponent')
  );

  get communityVaultsWithoutError$(): Observable<StoreState<Vault | null>[]> {
    return this.communityVaults$.pipe(map((vaults) => vaults.filter((vault) => vault.error === null)));
  }

  ngOnInit(): void {
    this.loadVaults();
  }

  loadVaults(): void {
    this.communityVaultsWithoutError$
      .pipe(
        mergeMap(() => this.isVaultsLoaded$),
        filter((isLoaded) => isLoaded === false),
        take(1)
      )
      .subscribe(() => this.store.dispatch(loadVaults()));
  }
}
