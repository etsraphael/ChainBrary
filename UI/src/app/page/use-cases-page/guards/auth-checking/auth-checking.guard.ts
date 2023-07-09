import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { AuthStatusCode } from './../../../../shared/enum';
import { AuthService } from './../../../../shared/services/auth/auth.service';
import { loadAuth } from './../../../../store/auth-store/state/actions';
import { selectAuthStatus, selectErrorAccount } from './../../../../store/auth-store/state/selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthCheckingGuard {
  authStatusCode$: Observable<AuthStatusCode>;
  errorAccount$: Observable<string | null>;

  constructor(private store: Store, private authService: AuthService) {
    this.authStatusCode$ = this.store.select(selectAuthStatus);
    this.errorAccount$ = this.store.select(selectErrorAccount);
  }

  canActivateChild(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const publicAddressSaved: string | null = this.authService.getPublicAddress();
    if (publicAddressSaved) this.logUser();
    return true;
  }

  logUser(): Subscription {
    return this.authStatusCode$.pipe(take(1)).subscribe((authStatusCode: AuthStatusCode) => {
      if (authStatusCode && AuthStatusCode.NotConnected) {
        return this.store.dispatch(loadAuth());
      } else if (authStatusCode && AuthStatusCode.NotVerifiedAndConnected) {
        return this.profileChecking();
      }
    });
  }

  profileChecking(): Subscription {
    return this.errorAccount$.pipe(take(1)).subscribe((errorMessage: string | null) => {
      if (!errorMessage) this.store.dispatch(loadAuth());
    });
  }
}
