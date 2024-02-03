import { Injectable, isDevMode } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  switchLanguage(lg: string): void {

    localStorage.setItem('userLanguage', lg);

    if (this.getLanguageFromUrl() === lg) {
      return; // Exit if no change is needed
    }

    if(isDevMode()) {
      this._snackBar.open(`Language is not avalaible in dev`, 'Close', {
        duration: 2000,
      });
      return;
    }

    let newUrl: string;
    const languageSegment = `/${lg}`;
    const languageRegex = /\/[a-z]{2}(\/|$)/;

    if (languageRegex.test(window.location.href)) {
      // Replace existing language segment
      newUrl = window.location.href.replace(languageRegex, `${languageSegment}$1`);
    } else {
      // Add language segment after the domain
      const urlParts = window.location.href.split('/');
      urlParts.splice(3, 0, lg); // Insert the language code after the third slash (http://domain/)
      newUrl = urlParts.join('/');
    }

    window.location.href = newUrl;
  }

  getLanguageFromUrl(): string {
    const languageRegex = /\/([a-z]{2})(\/|$)/;
    const match: RegExpExecArray | null = languageRegex.exec(window.location.href);

    return match ? match[1] : 'en';
  }

  getLanguageFromBrowser(): string {
    return navigator.language.split('-')[0];
  }

  initLanguage(): void {
    if(isDevMode()) return;

    const savedLanguage: string | null = localStorage.getItem('userLanguage');
    const languageFromUrl: string = this.getLanguageFromUrl();
    const languageFromBrowser: string = this.getLanguageFromBrowser();


    let language = 'en'; // default to 'en' if no other language is found
    if (savedLanguage) {
      language = savedLanguage;
    } else if (languageFromUrl !== 'en') {
      language = languageFromUrl;
    } else {
      language = languageFromBrowser;
    }

    return this.switchLanguage(language);
  }
}
