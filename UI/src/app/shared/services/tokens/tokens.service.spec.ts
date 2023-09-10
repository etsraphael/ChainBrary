import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { TokensService } from './tokens.service';
import { Erc20Service } from '@chainbrary/token-bridge';

describe('TokensService', () => {
  let tokensService: TokensService;
  let erc20Service: Erc20Service;

  beforeEach(() => {
    erc20Service = new Erc20Service();
    tokensService = new TokensService(erc20Service);
  });

  it('should be created', () => {
    expect(tokensService).toBeTruthy();
  });
});
