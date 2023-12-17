import { Component } from '@angular/core';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';

@Component({
  selector: 'app-document-locker-maker',
  templateUrl: './document-locker-maker.component.html',
  styleUrls: ['./document-locker-maker.component.scss']
})
export class DocumentLockerMakerComponent {
  headerPayload: IUseCasesHeader = {
    title: 'Create a locked document',
    goBackLink: '/use-cases/document-locker/services',
    description: null
  };
}
