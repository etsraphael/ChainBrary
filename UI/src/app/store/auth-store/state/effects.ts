import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AccountService } from '../services/account/account.service';
import { IProfileAdded } from './../../../shared/interfaces';
import * as AuthActions from './actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private accountService: AccountService) {}

  loadAuth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadAuth),
      mergeMap(() =>
        this.accountService.getAccountByPublicAddress('0xbA3Fc0648186a79baEF8DCeE9e055873F432a351').pipe(
          map((response: ApolloQueryResult<{ profileAddeds: IProfileAdded[] }>) =>
            AuthActions.loadAuthSuccess({ auth: response.data.profileAddeds[0] })
          ),
          catchError(() => of(AuthActions.loadAuthFailure({ message: 'Error loading auth' })))
        )
      )
    );
  });
}
