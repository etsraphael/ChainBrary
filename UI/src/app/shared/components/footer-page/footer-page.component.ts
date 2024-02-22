import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-page',
  templateUrl: './footer-page.component.html',
  styleUrls: ['./footer-page.component.scss']
})
export class FooterPageComponent {
  footerBtns: IFooterBtn[] = [
    {
      text: 'Discord',
      url: 'https://discord.gg/YPzkt2dM6C',
      icon: 'bi-discord'
    },
    {
      text: 'Twitter',
      url: 'https://twitter.com/chainbrary',
      icon: 'bi-twitter-x'
    },
    {
      text: 'Github',
      url: 'https://github.com/etsraphael/ChainBrary',
      icon: 'bi-github'
    },
    {
      text: 'Medium',
      url: 'https://iamraphaelsalei.medium.com',
      icon: 'bi-medium'
    },
    {
      text: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61555823715468',
      icon: 'bi-facebook'
    },
    {
      text: 'Instagram',
      url: 'https://www.instagram.com/chainbrary',
      icon: 'bi-instagram'
    }
  ];

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

interface IFooterBtn {
  text: string;
  url: string;
  icon: string;
}

interface IFooterItem {
  title: string;
  url: string;
}
