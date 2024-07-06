import { Component } from '@angular/core';
import { IUseCasesActionCard } from './../../../../../../page/use-cases-page/components/use-cases-action-card/use-cases-action-card.component';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';

@Component({
  selector: 'app-setup-token-menu',
  templateUrl: './setup-token-menu.component.html',
  styleUrl: './setup-token-menu.component.scss'
})
export class SetupTokenMenuComponent {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@useCasesSetUpTokenTitle:Set up token`,
    goBackLink: '/use-cases/services',
    description: $localize`:@@useCasesSetUpTokenDescription:Simple, Fast, Convenient to create tokens.Get 100% ownership of generated tokens with Custom token name, symbol and initial supply. Automatic verified and published contract source code.`
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      id: 'print-qr-code',
      title: $localize`:@@printCreateTokenTitle:Create Token`,
      descritpion: $localize`:@@printCreateTokenDescription:Create your own token with custom name, symbol and initial supply.`,
      routerLink: '/use-cases/shop-qr-code/qr-code-creation', // TODO: Change route here when ready
      buttonText: $localize`:@@commonButtonTextStartCreation:Start creation`,
      imgSrc: 'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/token-creation.svg'
    },
    {
      id: 'scan-qr-to-pay',
      title: $localize`:@@scanManageTokenTitle:Manage Token`,
      descritpion: $localize`:@@scanManageTokenDescription: Manage your token by minting, burning, transferring and more.`,
      routerLink: './../../../qr-code-scanning',
      buttonText: $localize`:@@commonTextManageNow:Manage`, // TODO: Change route here when ready
      imgSrc: 'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/setup-token-management.svg'
    }
  ];
}
