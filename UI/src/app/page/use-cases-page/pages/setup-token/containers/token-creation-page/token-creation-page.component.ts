import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { ITokenCreationPayload } from './../../../../../../shared/interfaces';
import { createToken } from './../../../../../../store/tokens-management-store/state/actions';

@Component({
  selector: 'app-token-creation-page',
  templateUrl: './token-creation-page.component.html',
  styleUrl: './token-creation-page.component.scss'
})
export class TokenCreationPageComponent {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@createTokenTitle:Create Token`,
    goBackLink: '/use-cases/setup-token/services',
    description: $localize`:@@printCreateTokenHeaderDescription:Simple, Fast, Convenient to create tokens. Get 100% ownership of generated tokens with Custom token name, symbol and initial supply. Automatic verified and published contract source code.`
  };
  tokenCreationPageTypes = TokenCreationPageTypes;
  currentPage = TokenCreationPageTypes.TokenCreation;
  tokenCreationPayload: ITokenCreationPayload;

  constructor(private store: Store) {}

  goToReviewPage(event: ITokenCreationPayload): void {
    this.tokenCreationPayload = event;
    this.currentPage = TokenCreationPageTypes.TokenReview;
  }

  createToken(): void {
    this.store.dispatch(createToken({ payload: this.tokenCreationPayload }));
  }

  goBack(): void {
    this.currentPage = TokenCreationPageTypes.TokenCreation;
  }
}

enum TokenCreationPageTypes {
  TokenCreation,
  TokenReview
}
