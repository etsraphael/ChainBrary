import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { communityVaults } from './../../../data/communityVaults.data';
import * as VaultsActions from './actions';

@Injectable()
export class VaultsEffects {
  constructor(
    private readonly store: Store,
    private actions$: Actions
  ) {}

  loadCommunityVaults$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(VaultsActions.loadVaults),
        map(() => {

          communityVaults.forEach((vault) => {
            console.log('vault', vault)
          })

        })
      );
    },
    { dispatch: false }
  );
}
