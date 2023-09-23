import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-page',
  templateUrl: './footer-page.component.html',
  styleUrls: ['./footer-page.component.scss']
})
export class FooterPageComponent implements OnInit {
  footerBtns: IFooterBtn[] = [];

  ngOnInit(): void {
    this.footerBtns = [
      {
        text: 'Twitter',
        url: 'https://twitter.com/chainbrary'
      },
      {
        text: 'Github',
        url: 'https://github.com/etsraphael/ChainBrary'
      },
      {
        text: 'Discord',
        url: 'https://discord.gg/Y3pTujEsMe'
      }
    ];
  }

  goToLinkOutsideApp(link: string): Window | null {
    return window.open(link, '_blank');
  }
}

interface IFooterBtn {
  text: string;
  url: string;
}
