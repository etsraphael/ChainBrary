import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import {
  ActionStoreProcessing,
  DocumentLockerRole,
  IDocumentLockerResponse
} from './../../../../../../shared/interfaces';
import { unlockDocumentSuccess } from './../../../../../../store/document-locker-store/state/actions';

enum DocumentLockerStatus {
  LOCKED,
  LOCKED_AND_OWNER,
  LOCKED_AND_BUYER,
  UNLOCKED_BY_OWNER,
  UNLOCKED_BY_OTHER_USER,
  UNLOCKED_BY_BUYER
}

@Component({
  selector:
    'app-document-locker-content[documentLockerContent][currentNetwork][hasAccessAs][unlockIsProcessing][unlockDocumentSuccessTriggerObs]',
  templateUrl: './document-locker-content.component.html',
  styleUrls: ['./document-locker-content.component.scss']
})
export class DocumentLockerContentComponent implements OnInit, OnDestroy {
  @Input() documentLockerContent: IDocumentLockerResponse;
  @Input() currentNetwork: INetworkDetail;
  @Input() hasAccessAs: DocumentLockerRole;
  @Input() unlockIsProcessing: ActionStoreProcessing;
  @Input() unlockDocumentSuccessTriggerObs: Observable<ReturnType<typeof unlockDocumentSuccess>>;
  @Output() unlockDocument: EventEmitter<{ hasAccess: boolean }> = new EventEmitter<{ hasAccess: boolean }>();
  @Output() lockDocumentOnScreen: EventEmitter<void> = new EventEmitter<void>();
  documentLockerStatusTypes = DocumentLockerStatus;
  paymentSuccessful = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

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
      case this.fileUnlocked && this.hasAccessAs === DocumentLockerRole.BUYER:
        return DocumentLockerStatus.UNLOCKED_BY_BUYER;
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

  get btnText(): string {
    const priceInfo = `${this.documentLockerContent.price} ${this.currentNetwork.nativeCurrency.symbol}`;
    return this.alreadySold
      ? $localize`:@@ocumentLockerContent.AlreadySoldAt: Already sold at ${priceInfo}`
      : `Unlock (${priceInfo})`;
  }

  ngOnInit(): void {
    this.listenActions();
  }

  listenActions(): void {
    this.unlockDocumentSuccessTriggerObs.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.paymentSuccessful = true;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
