import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { IDocumentLockerResponse } from './../../../../../../shared/interfaces';

@Component({
  selector: 'app-document-locker-content[documentLockerContent][currentNetwork]',
  templateUrl: './document-locker-content.component.html',
  styleUrls: ['./document-locker-content.component.scss']
})
export class DocumentLockerContentComponent {
  @Input() documentLockerContent: IDocumentLockerResponse;
  @Input() currentNetwork: INetworkDetail;
  @Output() unlockDocument: EventEmitter<{ hasAccess: boolean }> = new EventEmitter<{ hasAccess: boolean }>();
  // TODO: @Input() has access


  get fileUnlocked(): boolean {
    return !!this.documentLockerContent.desc
  }
}
