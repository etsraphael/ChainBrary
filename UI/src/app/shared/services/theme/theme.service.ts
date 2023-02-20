import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ThemeTypes } from '../../enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  get currentTheme(): ThemeTypes {
    const theme: string | null = localStorage.getItem('theme');
    if (theme) return theme as ThemeTypes;
    else return ThemeTypes.Light;
  }

  get pathAssets(): string {
    return `/assets/icons/${this.currentTheme}/`;
  }

  initTheme(): void {
    if (this.currentTheme) this.loadTheme(this.currentTheme as ThemeTypes);
    else this.loadTheme(ThemeTypes.Light);
  }

  loadTheme(themeName: ThemeTypes): void {
    localStorage.setItem('theme', themeName);
    const head = this.document.getElementsByTagName('head')[0];
    const themeSrc = this.document.getElementById('client-theme') as HTMLLinkElement;

    if (themeSrc) {
      themeSrc.href = `${themeName}.css`;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${themeName}.css`;

      head.appendChild(style);
    }
  }

  toggleTheme(): void {
    if (this.currentTheme === ThemeTypes.Light) this.loadTheme(ThemeTypes.Dark);
    else this.loadTheme(ThemeTypes.Light);
  }
}
