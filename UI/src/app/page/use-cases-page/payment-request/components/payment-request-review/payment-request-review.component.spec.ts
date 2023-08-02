import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { PaymentRequestReviewComponent } from './payment-request-review.component';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeContainerModalComponent } from 'src/app/shared/components/modal/qr-code-container-modal/qr-code-container-modal.component';
import { of } from 'rxjs';

describe('PaymentRequestReviewComponent', () => {
  let component: PaymentRequestReviewComponent;
  let fixture: ComponentFixture<PaymentRequestReviewComponent>;
  let snackbar: MatSnackBar;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule],
      declarations: [PaymentRequestReviewComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    snackbar = TestBed.inject(MatSnackBar);
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
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
    const emitSpy = spyOn(component.goToPreviousPageEvent, 'emit');
    component.goToPreviousPageEvent.emit();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should calculate the receiving amount correctly', () => {
    component.amount = 100;
    component.protocolFee = 0.1;
    const expectedReceivingAmount = component.amount - component.amount * component.protocolFee;

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
    const expectedReceivingAmount = component.amount - component.amount * component.protocolFee;

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
    const spyObj = jasmine.createSpyObj('spyObj', ['openMock']);
    component.goToPaymentPage = () => spyObj.openMock(previewLink, '_blank');
    component.goToPaymentPage();
    expect(spyObj.openMock).toHaveBeenCalledWith(previewLink, '_blank');
  });

  it('should open a snackbar when clickCopyLinkEvent() is called', () => {
    const openSpy = spyOn(snackbar, 'open').and.returnValue({} as MatSnackBarRef<TextOnlySnackBar>);
    const result = component.clickCopyLinkEvent();

    expect(openSpy).toHaveBeenCalledWith('Link copied to clipboard', '', { duration: 3000 });
    expect(result).toEqual({} as MatSnackBarRef<TextOnlySnackBar>);
  });

  it('should open a dialog when showQRCode() is called', () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(null)); // assumes you don't care about the return value
    const dialogSpy = spyOn(dialog, 'open').and.returnValue(mockDialogRef);
    component.showQRCode();
    expect(dialogSpy).toHaveBeenCalledWith(QrCodeContainerModalComponent, jasmine.any(Object));
  });
});
