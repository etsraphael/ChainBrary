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
        text: 'Discord',
        url: 'https://discord.gg/YPzkt2dM6C',
        icon: 'bi-discord'
      },
      {
        text: 'Twitter',
        url: 'https://twitter.com/chainbrary',
        icon: 'bi-twitter-x'
      },
      {
        text: 'Github',
        url: 'https://github.com/etsraphael/ChainBrary',
        icon: 'bi-github'
      },
      {
        text: 'Medium',
        url: 'https://iamraphaelsalei.medium.com',
        icon: 'bi-medium'
      },
      {
        text: 'Facebook',
        url: 'https://www.facebook.com/profile.php?id=61555823715468',
        icon: 'bi-facebook'
      },
      {
        text: 'Instagram',
        url: 'https://www.instagram.com/chainbrary',
        icon: 'bi-instagram'
      }
    ];
  }

  scrollToTop(): void {
    return window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToLinkOutsideApp(link: string): Window | null {
    return window.open(link, '_blank');
  }
}

interface IFooterBtn {
  text: string;
  url: string;
  icon: string;
}
