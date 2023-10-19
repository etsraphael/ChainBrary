import { TestBed } from '@angular/core/testing';

import { BraveWalletProviderService } from './brave-wallet-provider.service';

describe('BraveWalletProviderService', () => {
  let service: BraveWalletProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BraveWalletProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
