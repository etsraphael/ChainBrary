import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeTypes } from './../../../../shared/enum';
import { ThemeService } from './../../../../shared/services/theme/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerBtns: IHeaderBtn[] = [];

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  get iconTheme(): string {
    return this.themeService.currentTheme === ThemeTypes.Light ? 'bi-moon-fill' : 'bi-brightness-high-fill';
  }

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

  toggleTheme(): void {
    return this.themeService.toggleTheme();
  }

  goToLinkOutsideApp(link: string): Window | null {
    return window.open(link, '_blank');
  }
}

interface IHeaderBtn {
  text: string;
  action: () => Promise<boolean> | Window | null;
}
