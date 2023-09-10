import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { TokenBridgeService } from './token-bridge.service';

describe('TokenBridgeService', () => {
  let tokenBridgeService: TokenBridgeService;

  it('should be created', () => {
    expect(tokenBridgeService).toBeFalsy();
  });
});
