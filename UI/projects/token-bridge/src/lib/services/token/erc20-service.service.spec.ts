import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { Erc20Service } from './erc20-service.service';

describe('Erc20Service', () => {
  let erc20Service: Erc20Service;

  it('should be created', () => {
    expect(erc20Service).toBeFalsy();
  });
});
