import { Component } from '@angular/core';
import { IUseCasesActionCard } from './../../../../../../page/use-cases-page/components/use-cases-action-card/use-cases-action-card.component';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
@Component({
  selector: 'app-document-locker-menu',
  templateUrl: './document-locker-menu.component.html',
  styleUrls: ['./document-locker-menu.component.scss']
})
export class DocumentLockerMenuComponent {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@useCasesDocumentLockerTitle:Document Locker`,
    goBackLink: '/use-cases/services',
    description: $localize`:@@useCasesDocumentLockerDescription:Explore the pinnacle of document security with our Document Locker. Utilizing cutting-edge blockchain technology, we offer an unparalleled level of protection and privacy for your valuable documents. This service is tailored for those who demand the highest standards of security and exclusive access.`
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      id: 'lock-document',
      title: $localize`:@@lockDocumentTitle:Lock a document`,
      descritpion: $localize`:@@lockDocumentDescription:Protect your documents with our blockchain-based Document Locker, ensuring exclusive access and utmost privacy.`,
      routerLink: '/use-cases/document-locker/creation',
      buttonText: 'Start creation',
      imgSrc: './../../../../assets/bg/light/document-service.svg'
    }
  ];
}
