import { TestBed } from '@angular/core/testing';

import { TokenBridgeService } from './token-bridge.service';

describe('TokenBridgeService', () => {
  let service: TokenBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
