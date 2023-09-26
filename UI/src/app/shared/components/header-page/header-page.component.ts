import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.scss']
})
export class HeaderPageComponent implements OnInit {
  headerBtns: IHeaderBtn[] = [];
  environment = environment;

  constructor(private router: Router) {}

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
}

interface IHeaderBtn {
  text: string;
  action: () => Promise<boolean> | Window | null;
  visible: boolean;
}
