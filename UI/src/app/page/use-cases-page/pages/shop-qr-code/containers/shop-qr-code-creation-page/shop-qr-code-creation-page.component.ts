import { Component } from '@angular/core';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';

@Component({
  selector: 'app-shop-qr-code-creation-page',
  templateUrl: './shop-qr-code-creation-page.component.html',
  styleUrls: ['./shop-qr-code-creation-page.component.scss']
})
export class ShopQrCodeCreationPageComponent {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@printQrCodeMakerTitle:Print QR Code`,
    goBackLink: '/use-cases/shop-qr-code/services',
    description: $localize`:@@printQrCodeMakerDesc:By accepting cryptocurrencies, you open doors to a broader customer base. Enhance your business's payment options by printing a QR code, allowing your customers to make seamless cryptocurrency transactions. Embrace the future of finance and offer your clientele the convenience and security of paying with digital currencies.`,
  };
}
