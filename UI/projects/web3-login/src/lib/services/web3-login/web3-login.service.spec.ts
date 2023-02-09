import { TestBed } from '@angular/core/testing';

import { Web3LoginService } from './web3-login.service';

describe('Web3LoginService', () => {
  let service: Web3LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
