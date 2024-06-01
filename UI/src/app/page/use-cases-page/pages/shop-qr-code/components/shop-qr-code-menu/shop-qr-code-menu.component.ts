import { Component } from '@angular/core';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { IUseCasesActionCard } from './../../../../components/use-cases-action-card/use-cases-action-card.component';

@Component({
  selector: 'app-shop-qr-code-menu',
  templateUrl: './shop-qr-code-menu.component.html',
  styleUrls: ['./shop-qr-code-menu.component.scss']
})
export class ShopQrCodeMenuComponent {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@useCasesShopQrCodeTitle:My QR Code`,
    goBackLink: '/use-cases/services',
    description: $localize`:@@useCasesShopQrCodeDescription:By accepting cryptocurrencies, you open doors to a broader customer base. Enhance your business's payment options by printing a QR code, allowing your customers to make seamless cryptocurrency transactions. Embrace the future of finance and offer your clientele the convenience and security of paying with digital currencies.`
  };

  useCaseActionCardsPayload: IUseCasesActionCard[] = [
    {
      id: 'print-qr-code',
      title: $localize`:@@printQRCodeTitle:Print QR code`,
      descritpion: $localize`:@@printQRCodeDescription:Enhance your business's payment options by printing a QR code, allowing your customers to make seamless cryptocurrency transactions.`,
      routerLink: '/use-cases/shop-qr-code/qr-code-creation',
      buttonText: 'Start creation',
      imgSrc: './../../../../assets/services/qr-code-shop.svg'
    },
    {
      id: 'scan-qr-to-pay',
      title: $localize`:@@scanQRToPayTitle:Scan QR to Pay`,
      descritpion: $localize`:@@scanQRToPayDescription:Scan QR code at the vendors and pay with crypto currency`,
      routerLink: './../../../qr-code-scanning',
      buttonText: 'Scan Now',
      imgSrc: './../../../../assets/services/qr-code-shop-2.svg'
    }
  ];
}
