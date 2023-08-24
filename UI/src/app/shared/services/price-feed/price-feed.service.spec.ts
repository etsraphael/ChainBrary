import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { PriceFeedService } from './price-feed.service';

describe('PriceFeedService', () => {
  let priceFeedService: PriceFeedService;

  beforeEach(() => {
    priceFeedService = new PriceFeedService();
  });

  it('should be created', () => {
    expect(priceFeedService).toBeTruthy();
  });
});
