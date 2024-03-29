import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, filter, take } from 'rxjs';
import { AuthStatusCode } from './../../../../shared/enum';
import { AuthService } from './../../../../shared/services/auth/auth.service';
import { loadAuth } from './../../../../store/auth-store/state/actions';
import { selectAuthStatus, selectErrorAccount } from './../../../../store/auth-store/state/selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthCheckingGuard {
  authStatusCodeTypes = AuthStatusCode;

  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  readonly authStatusCode$: Observable<AuthStatusCode> = this.store.select(selectAuthStatus);
  readonly errorAccount$: Observable<string | null> = this.store.select(selectErrorAccount);

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const publicAddressSaved: string | null = this.authService.getPublicAddress();
    if (publicAddressSaved) this.logUser();
    return true;
  }

  logUser(): Subscription {
    return this.authStatusCode$
      .pipe(
        take(1),
        filter((authStatusCode: AuthStatusCode) => authStatusCode === AuthStatusCode.NotConnected)
      )
      .subscribe(() => this.store.dispatch(loadAuth()));
  }
}
