import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import QRCode from 'qrcode';

@Component({
  selector: 'app-shop-qr-code-visual[cardType][name]',
  templateUrl: './shop-qr-code-visual.component.html',
  styleUrls: ['./shop-qr-code-visual.component.scss']
})
export class ShopQrCodeVisualComponent {
  @Input() cardType: number;
  @Input() name: string;

  safeQrCodeSvg: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    const url = 'http://localhost:4200/pay-now/ewogICJwdWJsaWNBZGRyZXNzIjoiMHhkMTc0YzlDMzFkZEE2RkZDNUUxMzM1NjY0Mzc0YzFFYkJFMjE0NGFmIiwKICAibmFtZSI6IkpvaG4gV2ljayIKfQ%3D%3D';
    this.generateQrCode(url).then(svg => {
      this.safeQrCodeSvg = this.sanitizeSvg(svg);
    });
  }

  generateQrCode(url: string): Promise<string> {
    return QRCode.toString(url, { type: 'svg' });
  }

  private sanitizeSvg(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

}
