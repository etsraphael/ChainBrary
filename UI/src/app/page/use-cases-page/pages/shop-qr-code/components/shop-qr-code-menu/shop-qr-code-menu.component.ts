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
      title: $localize`:@@lockDocumentTitle:Lock a document`,
      descritpion: $localize`:@@lockDocumentDescription:Protect your documents with our blockchain-based Document Locker, ensuring exclusive access and utmost privacy.`,
      routerLink: '/use-cases/document-locker/creation',
      buttonText: 'Start creation',
      imgSrc: './../../../../assets/bg/light/document-service.svg'
    },
    {
      title: $localize`:@@lockDocumentTitle:Lock a document`,
      descritpion: $localize`:@@lockDocumentDescription:Protect your documents with our blockchain-based Document Locker, ensuring exclusive access and utmost privacy.`,
      routerLink: '/use-cases/document-locker/creation',
      buttonText: 'Start creation',
      imgSrc: './../../../../assets/bg/light/document-service.svg'
    }
  ];
}
