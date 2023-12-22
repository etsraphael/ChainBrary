import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { IDocumentLockerResponse, IDocumentUnlockedResponse } from './../../../../../../shared/interfaces';

@Component({
  selector: 'app-document-locker-content[documentLockerContent][currentNetwork]',
  templateUrl: './document-locker-content.component.html',
  styleUrls: ['./document-locker-content.component.scss']
})
export class DocumentLockerContentComponent {
  @Input() documentLockerContent: IDocumentLockerResponse | IDocumentUnlockedResponse;
  @Input() currentNetwork: INetworkDetail;
  @Output() unlockDocument: EventEmitter<{ hasAccess: boolean }> = new EventEmitter<{ hasAccess: boolean }>();
}
