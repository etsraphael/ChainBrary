import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { initialState as authInitialState } from './../../../../store/auth-store/state/init';
import { AuthCheckingGuard } from './auth-checking.guard';

describe('AuthCheckingGuard', () => {
  let guard: AuthCheckingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState
        })
      ]
    });
    guard = TestBed.inject(AuthCheckingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
