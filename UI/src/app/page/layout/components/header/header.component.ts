import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerBtns: IHeaderBtn[] = [];

  ngOnInit(): void {
    this.headerBtns = [
      {
        text: 'Home',
        action: () => {}
      },
      {
        text: 'Github',
        action: () => this.goToLinkOutsideApp('https://github.com/etsraphael/ChainBrary')
      },
      {
        text: 'Discord',
        action: () => this.goToLinkOutsideApp('https://discord.gg/Y3pTujEsMe')
      }
    ];
  }

  goToLinkOutsideApp(link: string): Window | null {
    return window.open(link, '_blank');
  }
}

interface IHeaderBtn {
  text: string;
  action: () => void;
}
