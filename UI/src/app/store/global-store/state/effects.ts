import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { tap } from 'rxjs';
import { ThemeService } from '../services/theme/theme.service';
import { initGlobalValues } from './actions';

@Injectable()
export class GlobalEffects implements OnInitEffects {
  constructor(private actions$: Actions, private themeService: ThemeService) {}

  ngrxOnInitEffects() {
    return initGlobalValues();
  }

  $initGlobalValues = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(initGlobalValues),
        tap(() => this.themeService.loadTheme('light'))
      );
    },
    { dispatch: false }
  );
}
