import { TestBed } from '@angular/core/testing';

import { Erc20ServiceService } from './erc20-service.service';

describe('Erc20ServiceService', () => {
  let service: Erc20ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Erc20ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
