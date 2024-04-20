import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-qr-code-scanning-page',
  templateUrl: './qr-code-scanning-page.component.html',
  styleUrls: ['./qr-code-scanning-page.component.scss']
})
export class QrCodeScanningPageComponent {

  constructor(
    public location: Location
  ) { }
}
