import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import {
  ActionStoreProcessing,
  DocumentLockerRole,
  IDocumentLockerResponse
} from './../../../../../../shared/interfaces';

enum DocumentLockerStatus {
  LOCKED,
  LOCKED_AND_OWNER,
  LOCKED_AND_BUYER,
  UNLOCKED_BY_OWNER,
  UNLOCKED_BY_OTHER_USER,
  UNLOCKED_BY_BUYER
}

@Component({
  selector: 'app-document-locker-content[documentLockerContent][currentNetwork][hasAccessAs][unlockIsProcessing]',
  templateUrl: './document-locker-content.component.html',
  styleUrls: ['./document-locker-content.component.scss']
})
export class DocumentLockerContentComponent {
  @Input() documentLockerContent: IDocumentLockerResponse;
  @Input() currentNetwork: INetworkDetail;
  @Input() hasAccessAs: DocumentLockerRole;
  @Input() unlockIsProcessing: ActionStoreProcessing;
  @Output() unlockDocument: EventEmitter<{ hasAccess: boolean }> = new EventEmitter<{ hasAccess: boolean }>();
  documentLockerStatusTypes = DocumentLockerStatus;

  get fileUnlocked(): boolean {
    return !!this.documentLockerContent.desc;
  }

  get alreadySold(): boolean {
    return this.documentLockerContent.accessAddress !== '0x0000000000000000000000000000000000000000';
  }

  get documentLockerStatus(): DocumentLockerStatus {
    switch (true) {
      case !this.fileUnlocked && this.hasAccessAs === DocumentLockerRole.OWNER:
        return DocumentLockerStatus.LOCKED_AND_OWNER;
      case this.alreadySold && this.hasAccessAs === DocumentLockerRole.NONE:
        return DocumentLockerStatus.UNLOCKED_BY_OTHER_USER;
      case this.fileUnlocked && this.hasAccessAs === DocumentLockerRole.OWNER:
        return DocumentLockerStatus.UNLOCKED_BY_OWNER;
      case this.fileUnlocked && this.hasAccessAs === DocumentLockerRole.NONE:
        return DocumentLockerStatus.UNLOCKED_BY_OTHER_USER;
      case !this.fileUnlocked && this.hasAccessAs === DocumentLockerRole.BUYER:
        return DocumentLockerStatus.LOCKED_AND_BUYER;
      default:
        return DocumentLockerStatus.LOCKED;
    }
  }

  get headerLocked(): boolean {
    return [
      DocumentLockerStatus.LOCKED,
      DocumentLockerStatus.UNLOCKED_BY_OTHER_USER,
      DocumentLockerStatus.LOCKED_AND_OWNER
    ].includes(this.documentLockerStatus);
  }

  get paymentBtnNotVisible(): boolean {
    return (
      this.documentLockerStatus === DocumentLockerStatus.UNLOCKED_BY_OTHER_USER ||
      this.fileUnlocked ||
      this.documentLockerStatus === DocumentLockerStatus.LOCKED_AND_BUYER
    );
  }

  get ownerUnlockingCardVisible(): boolean {
    return (
      this.hasAccessAs === DocumentLockerRole.OWNER &&
      this.documentLockerStatus === DocumentLockerStatus.LOCKED_AND_OWNER
    );
  }
}
