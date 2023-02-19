import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerBtns: IHeaderBtn[] = [];

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
