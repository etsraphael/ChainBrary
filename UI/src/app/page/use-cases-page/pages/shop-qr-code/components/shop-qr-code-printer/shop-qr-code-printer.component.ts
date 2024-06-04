import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonButtonText } from './../../../../../../shared/enum';

export interface QRCodeForm {
  name: FormControl<string | null>;
  publicAddress: FormControl<string | null>;
}
@Component({
  selector: 'app-shop-qr-code-printer',
  templateUrl: './shop-qr-code-printer.component.html',
  styleUrls: ['./shop-qr-code-printer.component.scss']
})
export class ShopQrCodePrinterComponent {
  mainForm: FormGroup<QRCodeForm> = new FormGroup({
    publicAddress: new FormControl<string | null>(null, [Validators.required, this.ethAddressValidator()]),
    name: new FormControl<string | null>(null, [Validators.required])
  });
  commonButtonText = CommonButtonText;
  cardTypes: number[] = [0, 1];
  cardSelected: null | number;

  constructor(private snackbar: MatSnackBar) {}

  get nameValue(): string {
    return this.mainForm.get('name')?.value || $localize`:@@CommonTextPlaceholder.Title:Business Name`;
  }

  selectCard(index: number): void {
    this.cardSelected = index;
  }

  print(): void {
    this.mainForm.markAllAsTouched();

    if (this.mainForm.invalid) {
      this.snackbar.open('Please fill in all the required fields', $localize`:@@commonWords:Close`, { duration: 3000 });
      return;
    }

    if (this.cardSelected == null) {
      this.snackbar.open('Please select a template first', $localize`:@@commonWords:Close`, { duration: 3000 });
      return;
    }

    const el = document.getElementById('shop-qr-code-visual-' + this.cardSelected) as HTMLElement;
    this.printService(el);
  }

  private printService(element: Element) {
    const printWindow = window.open('', '_blank', 'width=1000,height=500');
    if (printWindow) {
      printWindow.document.write(
        '<html><head><title>Printable</title><style>.code-container{width: 70%;position: absolute;left: 11.5%; bottom: 17.5%;text-align: center;padding: 1.5rem}</style></head><body>' +
          element.outerHTML +
          '</body></html>'
      );
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      this.closePrintWindow(printWindow);
    }
  }

  private closePrintWindow(printWindow: Window): void {
    setTimeout(() => printWindow.close(), 500);
  }

  private ethAddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (!value) return null;

      const isHex = /^0x[a-fA-F0-9]{40}$/.test(value);
      return isHex ? null : { invalidAddress: true };
    };
  }
}
