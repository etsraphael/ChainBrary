import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { QrCodeContainerModalComponent } from './../../../../../../shared/components/modal/qr-code-container-modal/qr-code-container-modal.component';
import { CommonButtonText } from './../../../../../../shared/enum';
import { IToken } from './../../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-review[username][amount][previewLink][valueLockedInUsd][tokenSelected]',
  templateUrl: './payment-request-review.component.html',
  styleUrls: ['./payment-request-review.component.scss']
})
export class PaymentRequestReviewComponent {
  @Input() username: string;
  @Input() amount: number;
  @Input() usdAmount: number | null;
  @Input() previewLink: string;
  @Input() valueLockedInUsd: boolean;
  @Input() tokenSelected: IToken | null;
  @Output() goToPreviousPageEvent = new EventEmitter<void>();
  commonButtonText = CommonButtonText;

  constructor(
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  get receivingAmount(): number {
    return this.amount;
  }

  get usdReceivingAmount(): number {
    return this.usdAmount ? Number(this.usdAmount.toFixed(2)) : 0;
  }

  goToPaymentPage(): Window | null {
    return window.open(this.previewLink, '_blank');
  }

  clickCopyLinkEvent(): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open($localize`:@@CommonText.LinkCopiedToClipboard:Link copied to clipboard`, '', {
      duration: 3000
    });
  }

  showQRCode(): MatDialogRef<QrCodeContainerModalComponent> {
    return this.dialog.open(QrCodeContainerModalComponent, {
      panelClass: ['col-9', 'col-sm-6', 'col-md-4', 'col-lg-4', 'col-xl-3', 'qr-code-container-modal'],
      enterAnimationDuration: 100,
      exitAnimationDuration: 100,
      data: {
        qrCodeValue: this.previewLink
      }
    });
  }
}
