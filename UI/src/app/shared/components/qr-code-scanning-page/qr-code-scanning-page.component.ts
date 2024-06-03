import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxScannerQrcodeComponent, ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
@Component({
  selector: 'app-qr-code-scanning-page',
  templateUrl: './qr-code-scanning-page.component.html',
  styleUrls: ['./qr-code-scanning-page.component.scss']
})
export class QrCodeScanningPageComponent implements OnInit, OnDestroy {
  @ViewChild(NgxScannerQrcodeComponent) scanner: NgxScannerQrcodeComponent;
  scannerConfig: ScannerQRCodeConfig = {
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

  constructor(
    public location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then(() => {
        this.scanner.start();

        this.scanner?.event.subscribe((result: ScannerQRCodeResult[]) => {
          this.scanner?.stop();
          this.router.navigate(['pay-now', result[0].value]);
        });
      })
      .catch((err) => {
        console.error('Error on get user media:', err);
      });
  }

  ngOnDestroy(): void {
    this.scanner?.stop();
  }
}
