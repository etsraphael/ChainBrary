import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of } from 'rxjs';
import { IAuth } from 'src/app/shared/interfaces';
import { AccountService } from '../services/account/account.service';
import { loadAuth, loadAuthSuccess } from './actions';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private accountService: AccountService) {}

  loadAuth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAuth),
      mergeMap(() =>
        this.accountService.getAccountByPublicAddress('0xbA3Fc0648186a79baEF8DCeE9e055873F432a351').pipe(
          map((response: ApolloQueryResult<IAuth>) => loadAuthSuccess({ auth: response.data })),
          catchError(() => of({ type: '[Auth] Load Auth Failure' }))
        )
      )
    );
  });
}
