import '@angular/compiler';
import '@ngrx/store';
import { AuthCheckingGuard } from './auth-checking.guard';
import { describe, expect, it, vi } from 'vitest';
import { instance } from 'ts-mockito';
import { AuthStatusCode } from '../../../../shared/enum';
import { authServiceMock, storeMock } from '../../../../shared/tests/mocks/services';
import { Subscription, of } from 'rxjs';
import { loadAuth } from 'src/app/store/auth-store/state/actions';
import { localStorageMock } from 'src/app/shared/tests/mocks/modules';

describe('AuthCheckingGuard', () => {
  const component: AuthCheckingGuard = new AuthCheckingGuard(instance(storeMock), authServiceMock);

  it('should create AuthCheckingGuard component', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if public address is saved', () => {
    component.authStatusCode$ = of(AuthStatusCode.NotConnected);
    localStorageMock.getItem.mockReturnValue('mockedPublicAddress');

    const result = component.canActivateChild();

    expect(result).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('publicAddress');
  });

  it('should dispatch loadAuth when authStatusCode is NotVerifiedAndConnected', () => {
    component.authStatusCode$ = of(AuthStatusCode.NotVerifiedAndConnected);

    const profileCheckingMock = vi.fn();
    vi.spyOn(component, 'profileChecking').mockImplementation(profileCheckingMock);

    const dispatchSpy = vi.spyOn(storeMock, 'dispatch');

    const result = component.logUser();

    expect(result).toBeInstanceOf(Subscription);
    expect(profileCheckingMock).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalledWith(loadAuth());
  });

  it('should not dispatch loadAuth when errorMessage is not null', () => {
    component.errorAccount$ = of<string | null>('error message');

    const dispatchSpy = vi.spyOn(storeMock, 'dispatch');
    component.profileChecking();

    expect(dispatchSpy).not.toHaveBeenCalled();
    const subscription = component.errorAccount$.subscribe();
    expect(dispatchSpy).not.toHaveBeenCalledWith(loadAuth());
    subscription.unsubscribe();
  });

});
