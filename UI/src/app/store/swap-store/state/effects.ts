import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DexService } from '../../../shared/services/dex/dex.service';

@Injectable()
export class SwapEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private readonly store: Store,
    private router: Router,
    private dexService: DexService
  ) {}

  // TODO: Implement swapping logic here
}
