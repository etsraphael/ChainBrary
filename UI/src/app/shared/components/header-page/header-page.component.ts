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

  ngOnInit(): void {
    this.headerBtns = [
      {
        text: 'Home',
        action: (): Promise<boolean> => this.router.navigate(['/'])
      },
      {
        text: 'Github',
        action: (): Window | null => this.goToLinkOutsideApp('https://github.com/etsraphael/ChainBrary')
      },
      {
        text: 'Discord',
        action: (): Window | null => this.goToLinkOutsideApp('https://discord.gg/Y3pTujEsMe')
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
}
