import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DexService } from '../../../shared/services/dex/dex.service';
import { catchError, from, map, of, switchMap } from 'rxjs';
import * as DexActions from './actions';

@Injectable()
export class SwapEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private readonly store: Store,
    private router: Router,
    private dexService: DexService
  ) {}

  loadPool$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadPoolAction),
      switchMap((action: ReturnType<typeof DexActions.loadPoolAction>) => {
        return from(this.dexService.getPool(action.payload)).pipe(
          map((response: string) => DexActions.loadPoolActionSuccess({ message: response })),
          catchError((error: string) => of(DexActions.loadPoolActionFailure({ message: error })))
        );
      })
    );
  });
}
