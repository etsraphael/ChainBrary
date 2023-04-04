import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { mergeMap, tap } from 'rxjs';
import { addressChecking } from '../../auth-store/state/actions';
import { ThemeService } from './../../../shared/services/theme/theme.service';
import { Web3EventsService } from './../../../shared/services/web3-events/web3-events.service';
import { initGlobalValues } from './actions';

@Injectable()
export class GlobalEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private themeService: ThemeService,
    private web3EventsService: Web3EventsService
  ) {}

  ngrxOnInitEffects() {
    return initGlobalValues();
  }

  $initGlobalValues = createEffect(() => {
    return this.actions$.pipe(
      ofType(initGlobalValues),
      tap(() => {
        this.themeService.initTheme();
        this.web3EventsService.init();
      }),
      mergeMap(() => [addressChecking()])
    );
  });
}
