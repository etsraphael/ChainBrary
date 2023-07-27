import { TestBed } from '@angular/core/testing';

import { AuthCheckingGuard } from './auth-checking.guard';
import { StoreModule } from '@ngrx/store';

describe('AuthCheckingGuard', () => {
  let guard: AuthCheckingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})]
    });
    guard = TestBed.inject(AuthCheckingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
