import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgxScannerQrcodeComponent, ScannerQRCodeConfig } from 'ngx-scanner-qrcode';
@Component({
  selector: 'app-qr-code-scanning-page',
  templateUrl: './qr-code-scanning-page.component.html',
  styleUrls: ['./qr-code-scanning-page.component.scss']
})
export class QrCodeScanningPageComponent implements OnInit {
  @ViewChild(NgxScannerQrcodeComponent) scanner: NgxScannerQrcodeComponent;
  scannerConfig: ScannerQRCodeConfig = {
    // square video
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
      .then((stream) => {
        // stream.getTracks().forEach((track: MediaStreamTrack) => track.stop()); // TODO: redirect the user to the new payment page
        this.scanner.start();
      })
      .catch((err) => {
        alert('oh');
        console.error('Error on get user media:', err);
      });
  }
}
