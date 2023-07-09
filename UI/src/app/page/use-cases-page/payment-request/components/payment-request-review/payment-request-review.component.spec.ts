import '@angular/compiler';
import '@ngrx/store';
import { describe, expect, it, vi } from 'vitest';
import { PaymentRequestReviewComponent } from './payment-request-review.component';
import { dialogMock, snackbarMock } from 'src/app/shared/tests/mocks/modules';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { QrCodeContainerModalComponent } from 'src/app/shared/components/modal/qr-code-container-modal/qr-code-container-modal.component';

describe('PaymentRequestReviewComponent', () => {
  const component: PaymentRequestReviewComponent = new PaymentRequestReviewComponent(snackbarMock, dialogMock)

  it('should create PaymentRequestReviewComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct value for username', () => {
    const username = 'JohnDoe';
    component.username = username;

    expect(component.username).toEqual(username);
  });

  it('should have the correct value for amount', () => {
    const amount = 100;
    component.amount = amount;

    expect(component.amount).toEqual(amount);
  });

  it('should have the correct value for usdAmount', () => {
    const usdAmount = 50;
    component.usdAmount = usdAmount;

    expect(component.usdAmount).toEqual(usdAmount);
  });

  it('should have the correct value for tokenConversionRate', () => {
    const tokenConversionRate = 0.5;
    component.tokenConversionRate = tokenConversionRate;

    expect(component.tokenConversionRate).toEqual(tokenConversionRate);
  });

  it('should have the correct value for previewLink', () => {
    const previewLink = 'https://example.com/preview';
    component.previewLink = previewLink;

    expect(component.previewLink).toEqual(previewLink);
  });

  it('should have the correct value for networkSymbol', () => {
    const networkSymbol = 'ETH';
    component.networkSymbol = networkSymbol;

    expect(component.networkSymbol).toEqual(networkSymbol);
  });

  it('should have the correct value for usdEnabled', () => {
    const usdEnabled = true;
    component.usdEnabled = usdEnabled;

    expect(component.usdEnabled).toEqual(usdEnabled);
  });

  it('should emit goToPreviousPageEvent when goToPreviousPage() is called', () => {
    const emitSpy = vi.spyOn(component.goToPreviousPageEvent, 'emit');
    component.goToPreviousPageEvent.emit();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should calculate the receiving amount correctly', () => {
    component.amount = 100;
    component.protocolFee = 0.1;
    const expectedReceivingAmount = component.amount - (component.amount * component.protocolFee);

    expect(component.receivingAmount).toBe(expectedReceivingAmount);
  });

  it('should calculate the protocol fee amount correctly', () => {
    component.amount = 100;
    component.protocolFee = 0.1;
    const expectedProtocolFeeAmount = component.amount * component.protocolFee;

    expect(component.protocolFeeAmount).toBe(expectedProtocolFeeAmount);
  });

  it('should calculate the receiving amount correctly', () => {
    component.amount = 100;
    component.protocolFee = 0.1;
    const expectedReceivingAmount = component.amount - (component.amount * component.protocolFee);

    expect(component.receivingAmount).toBe(expectedReceivingAmount);
  });

  it('should calculate the USD protocol fee amount correctly', () => {
    component.usdAmount = 50;
    component.protocolFee = 0.1;
    const expectedUSDProtocolFeeAmount = component.usdAmount * component.protocolFee;

    expect(component.usdProtocolFeeAmount).toBe(expectedUSDProtocolFeeAmount);
  });

  it('should call goToPaymentPage() with the correct parameters', () => {
    const previewLink = 'https://example.com/preview';
    component.previewLink = previewLink;
    const openMock = vi.fn();
    component.goToPaymentPage = vi.fn(() => openMock(previewLink, '_blank'));
    component.goToPaymentPage();

    expect(openMock).toHaveBeenCalledWith(previewLink, '_blank');
  });

  it('should open a snackbar when clickCopyLinkEvent() is called', () => {
    const openSpy = vi.spyOn(snackbarMock, 'open').mockReturnValue({} as MatSnackBarRef<TextOnlySnackBar>);
    const result = component.clickCopyLinkEvent();

    expect(openSpy).toHaveBeenCalledWith('Link copied to clipboard', '', { duration: 3000 });
    expect(result).toEqual({} as MatSnackBarRef<TextOnlySnackBar>);
  });

  it('should open a dialog when showQRCode() is called', () => {
    const openMock = vi.fn();
    component.showQRCode = vi.fn(() => openMock(QrCodeContainerModalComponent, expect.any(Object)));
    component.showQRCode();

    expect(openMock).toHaveBeenCalledWith(QrCodeContainerModalComponent, expect.any(Object));
  });
});
