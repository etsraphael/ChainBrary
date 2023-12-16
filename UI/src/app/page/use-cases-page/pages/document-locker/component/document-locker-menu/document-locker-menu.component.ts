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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc sit amet nisl.'
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      title: 'Lock a document',
      descritpion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc sit amet nisl',
      routerLink: '/use-cases/document-locker/creation',
      buttonText: 'Start creation'
    }
  ];
}
