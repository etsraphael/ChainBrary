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
}
