import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.scss']
})
export class HeaderPageComponent implements OnInit {
  language: string[] = ['en', 'fr'];
  languageSelected = 'en';
  headerBtns: IHeaderBtn[] = [];
  environment = environment;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  get headerButtons(): IHeaderBtn[] {
    return this.headerBtns.filter((btn) => btn.visible);
  }

  ngOnInit(): void {
    this.setUpNavButtons();
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


  switchLanguage(lang: string) {
    // Save the selected language
    this.languageSelected = lang;

    // Replace the current URL with the new language prefix
    const url = this.location.path().replace(/\/[a-z]{2}(\/|$)/, `/${lang}$1`);
    if(url) {
      window.location.href = url;
    }
    console.log(url);

    // Alternatively, if you have a more complex setup or want to avoid a full page reload,
    // you might need a different approach, like using a service to dynamically load and apply translations.
  }


}

interface IHeaderBtn {
  text: string;
  action: () => Promise<boolean> | Window | null;
  visible: boolean;
}
