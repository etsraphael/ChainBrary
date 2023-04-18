import { TestBed } from '@angular/core/testing';

import { AuthCheckingGuard } from './auth-checking.guard';

describe('AuthCheckingGuard', () => {
  let guard: AuthCheckingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthCheckingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
