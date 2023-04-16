import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment-request-review[username][amount][previewLink]',
  templateUrl: './payment-request-review.component.html',
  styleUrls: ['./payment-request-review.component.scss']
})
export class PaymentRequestReviewComponent {
  @Input() username: string;
  @Input() amount: number;
  @Input() previewLink: string;
  @Output() goToPreviousPageEvent = new EventEmitter<void>();
  protocolFee = 0.001;

  constructor(private snackbar: MatSnackBar) {}

  get receivingAmount(): number {
    return this.amount - this.protocolFee;
  }

  get protocolFeeAmount(): number {
    return this.amount * this.protocolFee;
  }

  goToPaymentPage(): Window | null {
    return window.open(this.previewLink, '_blank');
  }

  clickCopyLinkEvent(): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open('Link copied to clipboard', '', { duration: 3000 });
  }
}
