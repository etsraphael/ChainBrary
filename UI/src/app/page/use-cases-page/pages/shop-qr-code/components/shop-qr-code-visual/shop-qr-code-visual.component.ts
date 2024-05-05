import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shop-qr-code-visual[cardType]',
  templateUrl: './shop-qr-code-visual.component.html',
  styleUrls: ['./shop-qr-code-visual.component.scss']
})
export class ShopQrCodeVisualComponent {
  @Input() cardType: number;
}
