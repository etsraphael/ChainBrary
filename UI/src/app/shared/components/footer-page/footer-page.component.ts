import { Component, OnInit } from '@angular/core';
import { SocialMediaCardItem } from '../../interfaces';
import { TranslationService } from '../../services/translation/translation.service';
import { environment } from './../../../../environments/environment';
import { footerListData } from './../../../data/socialMediaCard.data';

@Component({
  selector: 'app-footer-page',
  templateUrl: './footer-page.component.html',
  styleUrls: ['./footer-page.component.scss']
})
export class FooterPageComponent implements OnInit {
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
    },
    {
      title: $localize`:@@footerBtn.Title.BountyProgram:Bounty Program`,
      url: '/landing-page/bounty-program'
    }
  ];

  whitePaperText = $localize`:@@footerBtn.Title.WhitePaper:White Paper`;
  language: string[] = ['en', 'es', 'fr'];
  languageSelected: string;
  environment = environment;

  constructor(private translationService: TranslationService) {}

  scrollToTop(): void {
    return window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToLinkOutsideApp(link: string): Window | null {
    return window.open(link, '_blank');
  }

  ngOnInit(): void {
    this.languageSelected = this.translationService.getLanguageFromUrl();
  }

  switchLanguage(lang: string): void {
    return this.translationService.switchLanguage(lang);
  }
}

interface IFooterItem {
  title: string;
  url: string;
}
