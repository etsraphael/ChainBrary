import { Component } from '@angular/core';
import { SocialMediaCardItem } from '../../interfaces';
import { footerListData } from './../../../data/socialMediaCard.data';

@Component({
  selector: 'app-footer-page',
  templateUrl: './footer-page.component.html',
  styleUrls: ['./footer-page.component.scss']
})
export class FooterPageComponent {
  footerBtns: SocialMediaCardItem[] = footerListData;

  footerList0: IFooterItem[] = [
    {
      title: $localize`:@@headerBtn.Title.Home:Home`,
      url: '/landing-page/home'
    },
    {
      title: $localize`:@@headerBtn.Title.Partnership:Partnership`,
      url: '/landing-page/partnership'
    },
    {
      title: $localize`:@@headerBtn.Title.Services:Services`,
      url: '/use-cases/services'
    }
  ];

  footerList1: IFooterItem[] = [
    {
      title: $localize`:@@footerBtn.Title.TermAndCond:Terms and Conditions`,
      url: '/landing-page/terms-and-conditions'
    },
    {
      title: $localize`:@@footerBtn.Title.PrivacyPolicy:Privacy Policy`,
      url: '/landing-page/privacy-policy'
    }
  ];

  whitePaperText = $localize`:@@footerBtn.Title.WhitePaper:White Paper`;

  scrollToTop(): void {
    return window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToLinkOutsideApp(link: string): Window | null {
    return window.open(link, '_blank');
  }
}

interface IFooterItem {
  title: string;
  url: string;
}
