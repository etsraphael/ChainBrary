import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  switchLanguage(lg: string): void {
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
}
