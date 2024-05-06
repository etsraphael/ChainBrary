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
    console.log('el', el);
  }
}
