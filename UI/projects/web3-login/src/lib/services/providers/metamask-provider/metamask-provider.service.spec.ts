import { TestBed } from '@angular/core/testing';

import { MetamaskProviderService } from './metamask-provider.service';

describe('MetamaskProviderService', () => {
  let service: MetamaskProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetamaskProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
