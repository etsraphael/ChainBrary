import { Injectable } from '@angular/core';
import { NetworkChainId, WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of } from 'rxjs';
import { communityVaults } from './../../../data/communityVaults.data';
import { Vault, VaultSupported } from './../../../shared/interfaces';
import { CommunityVaultsService } from './../../../shared/services/community-vaults/community-vaults.service';
import * as VaultsActions from './actions';

@Injectable()
export class VaultsEffects {
  constructor(
    private actions$: Actions,
    private communityVaultsService: CommunityVaultsService,
    private web3LoginService: Web3LoginService
  ) {}

  loadCommunityVaults$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VaultsActions.loadVaults),
      mergeMap(() => from(communityVaults)),
      map((vault: VaultSupported) =>
        VaultsActions.loadVaultById({
          txnHash: vault.txnHash,
          networkDetail: this.web3LoginService.getNetworkDetailByChainId(vault.chainId)
        })
      )
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
          catchError((error: string) =>
            of(VaultsActions.loadVaultByNetworkFailure({ chainId: action.networkDetail.chainId, message: error }))
          )
        )
      )
    );
  });
}
