import { describe, expect, it, beforeEach } from 'vitest';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let tokensService: TokensService;

  beforeEach(() => {
    tokensService = new TokensService();
  });

  it('should be created', () => {
    expect(tokensService).toBeTruthy();
  });
});
