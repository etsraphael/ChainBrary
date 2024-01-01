import { Component } from '@angular/core';
import { IUseCasesActionCard } from './../../../../../../page/use-cases-page/components/use-cases-action-card/use-cases-action-card.component';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
@Component({
  selector: 'app-document-locker-menu',
  templateUrl: './document-locker-menu.component.html',
  styleUrls: ['./document-locker-menu.component.scss']
})
export class DocumentLockerMenuComponent {
  headerPayload: IUseCasesHeader = {
    title: 'Document Locker',
    goBackLink: '/use-cases/services',
    description:
      'Explore the pinnacle of document security with our Document Locker. Utilizing cutting-edge blockchain technology, we offer an unparalleled level of protection and privacy for your valuable documents. This service is tailored for those who demand the highest standards of security and exclusive access.'
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      title: 'Lock a document',
      descritpion:
        'Protect your documents with our blockchain-based Document Locker, ensuring exclusive access and utmost privacy.',
      routerLink: '/use-cases/document-locker/creation',
      buttonText: 'Start creation'
    }
  ];
}
