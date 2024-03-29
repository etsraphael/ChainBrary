import { Component, Input } from '@angular/core';
import { StoreState, Vault } from './../../../../shared/interfaces';

@Component({
  selector: 'app-community-vault-card[vault]',
  templateUrl: './community-vault-card.component.html',
  styleUrls: ['./community-vault-card.component.scss']
})
export class CommunityVaultCardComponent {
  @Input() vault: StoreState<Vault | null>;

  get networkShareToken(): string {
    const { userStaked, TVS } = this.vault?.data?.data ?? {};
    if (userStaked === undefined || userStaked === 0 || TVS === undefined || TVS === 0) {
      return '0 %';
    }
    return `${((userStaked / TVS) * 100).toFixed(2)} %`;
  }
}
