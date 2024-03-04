import { Component } from '@angular/core';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';

@Component({
  selector: 'app-community-vaults-list-page-container',
  templateUrl: './community-vaults-list-page-container.component.html',
  styleUrls: ['./community-vaults-list-page-container.component.scss']
})
export class CommunityVaultsListPageContainerComponent {
  headerPayload: IHeaderBodyPage = {
    title: `Community Vault`,
    goBackLink: null,
    description: `Community Vault mechanism, a cornerstone feature of the Chainbrary ecosystem. It intricately details how the Community Vault functions as a dynamic system for distributing rewards, ensuring that each member's contribution to the network is recognized and fairly compensated.`
  };
}
