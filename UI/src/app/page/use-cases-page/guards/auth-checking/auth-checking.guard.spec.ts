import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { AuthCheckingGuard } from './auth-checking.guard';
import { storeMock } from '../../../../shared/tests';
import { authServiceMock } from '../../../../shared/tests';
import { AuthStatusCode } from '../../../../shared/enum';
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
    const codeSub$ = new Subject<AuthStatusCode>();
    const errorSub$ = new Subject<string | null>();
    component.authStatusCode$ = codeSub$.asObservable();
    component.errorAccount$ = errorSub$.asObservable();
    const spyOnLoadAuth = vi.spyOn(actions, 'loadAuth');

    component.logUser();

    codeSub$.next(AuthStatusCode.NotConnected);
    /* If the status code is 'NotVerifiedAndConnected', we end up in the
    'profileChecking' method which also calls 'loadAuth'. To avoid ending
    up in this situation, we populate the 'errorAccount$' variable */
    errorSub$.next('An error occured');
    expect(spyOnLoadAuth).toHaveBeenCalledTimes(1);
  });

  it('should check profile if authentication status is "NotVerifiedAndConnected"', () => {
    const codeSub$ = new Subject<AuthStatusCode>();
    component.authStatusCode$ = codeSub$.asObservable();
    const spyOnProfileChecking = vi.spyOn(component, 'profileChecking');

    component.logUser();
    codeSub$.next(AuthStatusCode.NotVerifiedAndConnected);

    expect(spyOnProfileChecking).toHaveBeenCalledTimes(1);
  });

  it('should not called loadAuth if errorAccount detected', () => {
    const errorSub$ = new Subject<string | null>();
    component.errorAccount$ = errorSub$.asObservable();
    const spyOnLoadAuth = vi.spyOn(actions, 'loadAuth');

    component.profileChecking();
    errorSub$.next('An error has occured');

    expect(spyOnLoadAuth).not.toHaveBeenCalled();
  });
});
