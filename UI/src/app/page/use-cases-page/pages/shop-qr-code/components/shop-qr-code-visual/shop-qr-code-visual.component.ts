import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shop-qr-code-visual[cardType][name]',
  templateUrl: './shop-qr-code-visual.component.html',
  styleUrls: ['./shop-qr-code-visual.component.scss']
})
export class ShopQrCodeVisualComponent {
  @Input() cardType: number;
  @Input() name: string;
}
