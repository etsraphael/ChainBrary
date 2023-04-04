import { TestBed } from '@angular/core/testing';

import { Web3EventsService } from './web3-events.service';

describe('Web3EventsService', () => {
  let service: Web3EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3EventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
