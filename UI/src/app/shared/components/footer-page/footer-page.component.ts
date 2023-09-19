import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-page',
  templateUrl: './footer-page.component.html',
  styleUrls: ['./footer-page.component.scss']
})
export class FooterPageComponent implements OnInit {
  footerBtns: IFooterBtn[] = [];

  constructor(private router: Router) {}

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
      },
      {
        text: 'Medium',
        url: 'https://iamraphaelsalei.medium.com'
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
