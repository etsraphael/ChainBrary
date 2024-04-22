import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgxScannerQrcodeComponent, ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
@Component({
  selector: 'app-qr-code-scanning-page',
  templateUrl: './qr-code-scanning-page.component.html',
  styleUrls: ['./qr-code-scanning-page.component.scss']
})
export class QrCodeScanningPageComponent implements OnInit {
  @ViewChild(NgxScannerQrcodeComponent) scanner: NgxScannerQrcodeComponent;
  scannerConfig: ScannerQRCodeConfig = {
    // TODO: This has to be uncommented to keep the scanner working
    constraints: {
      video: {
        width: {
          ideal: 100
        },
        height: {
          ideal: 100
        }
      }
    }
  };

  constructor(public location: Location) {}

  ngOnInit(): void {
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then(() => {
        this.scanner.start();

        this.scanner?.event.subscribe((result: ScannerQRCodeResult[]) => {
          // TODO: Redirect to the page with the scanned QR code
          console.log('Scanned QR code:', result);
          this.scanner?.stop();
        });
      })
      .catch((err) => {
        console.error('Error on get user media:', err);
      });
  }
}
