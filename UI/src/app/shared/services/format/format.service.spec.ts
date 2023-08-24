import { describe, expect, it, beforeEach } from 'vitest';
import { FormatService } from './format.service';

describe('FormatService', () => {
  let formatService: FormatService;

  beforeEach(() => {
    formatService = new FormatService();
  });

  it('should be created', () => {
    expect(formatService).toBeTruthy();
  });
});
