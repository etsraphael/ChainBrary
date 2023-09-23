import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { QrCodeContainerModalComponent } from './../../../../../shared/components/modal/qr-code-container-modal/qr-code-container-modal.component';
import { dialogMock, snackbarMock } from '../../../../../shared/tests';
import { PaymentRequestReviewComponent } from './payment-request-review.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('PaymentRequestReviewComponent', () => {
  const component: PaymentRequestReviewComponent = new PaymentRequestReviewComponent(
    snackbarMock,
    dialogMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit goToPreviousPageEvent when goToPreviousPage() is called', () => {
    const spyOnEmit = vi.spyOn(component.goToPreviousPageEvent, 'emit');
    component.goToPreviousPageEvent.emit();

    expect(spyOnEmit).toHaveBeenCalled();
  });

  it('should open a snackbar when clickCopyLinkEvent() is called', () => {
    const spyOnOpen = vi.spyOn(snackbarMock, 'open')
      .mockReturnValue({} as MatSnackBarRef<TextOnlySnackBar>);
    component.clickCopyLinkEvent();

    expect(spyOnOpen).toHaveBeenCalledWith('Link copied to clipboard', '', { duration: 3000 });
  });

  it('should open a dialog when showQRCode() is called', () => {
    const spyOnOpen = vi.spyOn(dialogMock, 'open')
      .mockReturnValue({} as MatDialogRef<QrCodeContainerModalComponent>);
    component.showQRCode();

    expect(spyOnOpen).toHaveBeenCalled();
  });
});
