import { TestBed } from '@angular/core/testing';

import { PrivateGlobalValuesService } from './private-global-values.service';

describe('PrivateGlobalValuesService', () => {
  let service: PrivateGlobalValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateGlobalValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
