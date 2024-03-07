import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, mergeMap, of } from 'rxjs';
import { communityVaults } from './../../../data/communityVaults.data';
import { Vault, VaultSupported } from './../../../shared/interfaces';
import { CommunityVaultsService } from './../../../shared/services/community-vaults/community-vaults.service';
import * as VaultsActions from './actions';
import { NetworkChainId, WalletProvider } from '@chainbrary/web3-login';

@Injectable()
export class VaultsEffects {
  constructor(
    private readonly store: Store,
    private actions$: Actions,
    private communityVaultsService: CommunityVaultsService
  ) {}

  loadCommunityVaults$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VaultsActions.loadVaults),
      mergeMap(() => from(communityVaults)),
      map((vault: VaultSupported) => VaultsActions.loadVaultById({ txnHash: vault.txnHash, chainId: vault.chainId }))
    );
  });

  loadCommunityVaultByTxnHash$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VaultsActions.loadVaultById),
      mergeMap((action: ReturnType<typeof VaultsActions.loadVaultById>) =>
        from(
          this.communityVaultsService.getCommunityVaultsFromTxnHash(
            WalletProvider.BRAVE_WALLET,
            action.txnHash,
            NetworkChainId.LOCALHOST
          )
        ).pipe(
          map((res: Vault) => VaultsActions.loadVaultByNetworkSuccess({ vault: res })),
          catchError((error: string) => {
            console.log('error', error)
            return of(VaultsActions.loadVaultByNetworkFailure({ message: error }))
          })
        )
      )
    );
  });
}
