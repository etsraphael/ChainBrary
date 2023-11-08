import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class BidEffects {
  constructor(
    private readonly store: Store,
    private actions$: Actions
  ) {}
}
