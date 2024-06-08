import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import QRCode from 'qrcode';
import { ReplaySubject, takeUntil } from 'rxjs';
import { QRCodeForm } from '../shop-qr-code-printer/shop-qr-code-printer.component';

@Component({
  selector: 'app-shop-qr-code-visual[cardType][data]',
  templateUrl: './shop-qr-code-visual.component.html',
  styleUrls: ['./shop-qr-code-visual.component.scss']
})
export class ShopQrCodeVisualComponent implements OnInit, OnDestroy {
  @Input() cardType: number;
  @Input() data: FormGroup<QRCodeForm>;
  safeQrCodeSvg: SafeHtml;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(private sanitizer: DomSanitizer) {}

  get name(): string {
    return this.data.get('name')?.value || $localize`:@@CommonTextPlaceholder.Title.BusinessName:Business Name`;
  }

  get subtitleName(): string {
    return $localize`:@@CommonTextPlaceholder.Title.ScanPay:Scan & Pay with Crypto tokens`;
  }

  ngOnInit(): void {
    this.generateDefaultQrCode();
    this.formListener();
  }

  private generateDefaultQrCode(): void {
    this.generateQrCode('/').then((svg: string) => {
      this.safeQrCodeSvg = this.sanitizeSvg(svg);
    });
  }

  private formListener(): void {
    this.data?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(
      (
        value: Partial<{
          name: string | null;
          publicAddress: string | null;
        }>
      ) => {
        const token = `${btoa(JSON.stringify(value))}`;
        this.generateQrCode(token).then((svg) => {
          this.safeQrCodeSvg = this.sanitizeSvg(svg);
        });
      }
    );
  }

  private generateQrCode(token: string): Promise<string> {
    const url: URL = new URL(window.location.href);
    const origin = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}/pay-now/`;
    return QRCode.toString(origin + token.replace('+', '-').replace('/', '_'), { type: 'svg' });
  }

  private sanitizeSvg(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
