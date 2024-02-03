import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { mergeMap, tap } from 'rxjs';
import { addressChecking } from '../../auth-store/state/actions';
import { TranslationService } from './../../../shared/services/translation/translation.service';
import { Web3EventsService } from './../../../shared/services/web3-events/web3-events.service';
import { initGlobalValues } from './actions';

@Injectable()
export class GlobalEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private web3EventsService: Web3EventsService,
    private translationService: TranslationService
  ) {}

  ngrxOnInitEffects() {
    return initGlobalValues();
  }

  $initGlobalValues = createEffect(() => {
    return this.actions$.pipe(
      ofType(initGlobalValues),
      tap(() => {
        this.translationService.initLanguage();
        this.web3EventsService.init();
      }),
      mergeMap(() => [addressChecking()])
    );
  });
}
