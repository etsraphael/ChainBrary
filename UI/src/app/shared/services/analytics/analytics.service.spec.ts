import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
  });

  it('should be created', () => {
    expect(analyticsService).toBeTruthy();
  });
});
