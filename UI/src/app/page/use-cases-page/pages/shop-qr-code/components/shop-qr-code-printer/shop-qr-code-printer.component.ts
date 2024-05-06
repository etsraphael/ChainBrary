import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonButtonText } from './../../../../../../shared/enum';

interface QRCodeForm {
  name: FormControl<string | null>;
}
@Component({
  selector: 'app-shop-qr-code-printer',
  templateUrl: './shop-qr-code-printer.component.html',
  styleUrls: ['./shop-qr-code-printer.component.scss']
})
export class ShopQrCodePrinterComponent {
  mainForm: FormGroup<QRCodeForm> = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required])
  });
  commonButtonText = CommonButtonText;
  cardTypes: number[] = [0, 1];
  cardSelected: null | number;

  get nameValue(): string {
    return this.mainForm.get('name')?.value || 'Business Name';
  }

  selectCard(index: number): void {
    this.cardSelected = index;
  }

  print(): void {
    const el = document.getElementById('shop-qr-code-visual-0') as HTMLElement;
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
      setTimeout(() => {
        printWindow.close();
      }, 500);
    }
  }
}
