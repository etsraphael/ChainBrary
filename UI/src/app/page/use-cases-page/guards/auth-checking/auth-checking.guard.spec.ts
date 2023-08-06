import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { AuthCheckingGuard } from './auth-checking.guard';
import { storeMock } from 'src/app/shared/tests/modules/modules.mock';
import { authServiceMock } from 'src/app/shared/tests/services/services.mock';
import { AuthStatusCode } from 'src/app/shared/enum';
import { Subject } from 'rxjs';
import * as actions from '../../../../store/auth-store/state/actions';

describe('AuthCheckingGuard', () => {
  const component: AuthCheckingGuard = new AuthCheckingGuard(
    storeMock,
    authServiceMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user if authentication status is "NotConnected"', () => {
    const code$ = new Subject<AuthStatusCode>();
    const error$ = new Subject<string | null>();
    component.authStatusCode$ = code$.asObservable();
    component.errorAccount$ = error$.asObservable();
    const spyLoadAuth = vi.spyOn(actions, 'loadAuth');

    component.logUser();

    code$.next(AuthStatusCode.NotConnected);
    /* If the status code is 'NotVerifiedAndConnected', we end up in the
    'profileChecking' method which also calls 'loadAuth'. To avoid ending
    up in this situation, we populate the 'errorAccount$' variable */
    error$.next('An error occured');
    expect(spyLoadAuth).toHaveBeenCalledTimes(1);
  });

  it('should check profile if authentication status is "NotVerifiedAndConnected"', () => {
    const code$ = new Subject<AuthStatusCode>();
    component.authStatusCode$ = code$.asObservable();
    const spyProfileChecking = vi.spyOn(component, 'profileChecking');

    component.logUser();
    code$.next(AuthStatusCode.NotVerifiedAndConnected);

    expect(spyProfileChecking).toHaveBeenCalledTimes(1);
  });

  it('should not called loadAuth if errorAccount detected', () => {
    const error$ = new Subject<string | null>();
    component.errorAccount$ = error$.asObservable();
    const spyLoadAuth = vi.spyOn(actions, 'loadAuth');

    component.profileChecking();
    error$.next('An error has occured');

    expect(spyLoadAuth).not.toHaveBeenCalled();
  });
});
