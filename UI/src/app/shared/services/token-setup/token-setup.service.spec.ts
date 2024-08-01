import { TestBed } from '@angular/core/testing';
import { TokenSetupService } from './token-setup.service';

describe('TokenSetupService', () => {
  let service: TokenSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
