import { Component, OnInit } from '@angular/core';
import '@angular/localize/init';
import { NavService } from '../../services/nav/nav.service';
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
  environment = environment;

  headerBtns: IHeaderBtn[] = [
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

  constructor(
    private translationService: TranslationService,
    public navService: NavService
  ) {}

  ngOnInit(): void {
    this.languageSelected = this.translationService.getLanguageFromUrl();
  }

  switchLanguage(lang: string): void {
    return this.translationService.switchLanguage(lang);
  }
}

interface IHeaderBtn {
  title: string;
  url: string;
}
