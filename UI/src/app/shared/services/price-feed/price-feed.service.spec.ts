import { TestBed } from '@angular/core/testing';
import { PriceFeedService } from './price-feed.service';

describe('PriceFeedService', () => {
  let service: PriceFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
