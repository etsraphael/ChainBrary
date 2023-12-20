import { Component, Input } from '@angular/core';
import { IDocumentLockerResponse, IDocumentUnlockedResponse } from './../../../../../../shared/interfaces';

@Component({
  selector: 'app-document-locker-content[documentLockerContent]',
  templateUrl: './document-locker-content.component.html',
  styleUrls: ['./document-locker-content.component.scss']
})
export class DocumentLockerContentComponent {
  @Input() documentLockerContent: IDocumentLockerResponse | IDocumentUnlockedResponse;
}
