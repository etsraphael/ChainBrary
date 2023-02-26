import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { mergeMap, tap } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { addressChecking } from '../../auth-store/state/actions';
import { initGlobalValues } from './actions';

@Injectable()
export class GlobalEffects implements OnInitEffects {
  constructor(private actions$: Actions, private themeService: ThemeService) {}

  ngrxOnInitEffects() {
    return initGlobalValues();
  }

  $initGlobalValues = createEffect(() => {
    return this.actions$.pipe(
      ofType(initGlobalValues),
      tap(() => {
        this.themeService.initTheme();
      }),
      mergeMap(() => [addressChecking()])
    );
  });
}
