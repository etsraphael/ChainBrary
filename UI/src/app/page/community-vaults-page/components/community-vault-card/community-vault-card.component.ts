import { Component, Input } from '@angular/core';
import { StoreState, Vault } from './../../../../shared/interfaces';

@Component({
  selector: 'app-community-vault-card[vault]',
  templateUrl: './community-vault-card.component.html',
  styleUrls: ['./community-vault-card.component.scss']
})
export class CommunityVaultCardComponent {
  @Input() vault: StoreState<Vault | null>;
}
