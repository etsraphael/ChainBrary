import { TestBed } from '@angular/core/testing';

import { TransactionSearchService } from './transaction-search.service';

describe('TransactionSearchService', () => {
  let service: TransactionSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
