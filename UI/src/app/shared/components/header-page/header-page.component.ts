import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation/translation.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.scss']
})
export class HeaderPageComponent implements OnInit {
  language: string[] = ['en', 'fr'];
  languageSelected: string;
  headerBtns: IHeaderBtn[] = [];
  environment = environment;

  constructor(
    private router: Router,
    private translationService: TranslationService
  ) {}

  get headerButtons(): IHeaderBtn[] {
    return this.headerBtns.filter((btn: IHeaderBtn) => btn.visible);
  }

  ngOnInit(): void {
    this.setUpNavButtons();
    this.languageSelected = this.translationService.getLanguageFromUrl();
  }

  setUpNavButtons(): void {
    this.headerBtns = [
      {
        text: 'Home',
        action: (): Promise<boolean> => this.router.navigate(['/']),
        visible: this.router.url !== '/'
      },
      {
        text: 'Github',
        action: (): Window | null => this.goToLinkOutsideApp('https://github.com/etsraphael/ChainBrary'),
        visible: true
      },
      {
        text: 'Discord',
        action: (): Window | null => this.goToLinkOutsideApp('https://discord.gg/Y3pTujEsMe'),
        visible: true
      }
    ];
  }

  goToLinkOutsideApp(link: string): Window | null {
    return window.open(link, '_blank');
  }

  switchLanguage(lang: string): void {
    return this.translationService.switchLanguage(lang);
  }
}

interface IHeaderBtn {
  text: string;
  action: () => Promise<boolean> | Window | null;
  visible: boolean;
}
