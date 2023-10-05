import { TestBed } from '@angular/core/testing';

import { PublicGlobalValuesService } from './public-global-values.service';

describe('PublicGlobalValuesService', () => {
  let service: PublicGlobalValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicGlobalValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
