import { Injectable } from '@angular/core';
import { tokenList } from '../../data/tokenList';
import { IToken } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  getTokensListed(): IToken[] {
    return tokenList;
  }
}
