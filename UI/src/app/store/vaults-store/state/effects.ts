import { Injectable } from '@angular/core';
import { WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, mergeMap, of, switchMap } from 'rxjs';
import { selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { communityVaults } from './../../../data/communityVaults.data';
import { IReceiptTransaction, Vault, VaultSupported } from './../../../shared/interfaces';
import { CommunityVaultsService } from './../../../shared/services/community-vaults/community-vaults.service';
import * as VaultsActions from './actions';

@Injectable()
export class VaultsEffects {
  constructor(
    private actions$: Actions,
    private communityVaultsService: CommunityVaultsService,
    private web3LoginService: Web3LoginService,
    private readonly store: Store
  ) {}

  loadCommunityVaults$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VaultsActions.loadVaults),
      mergeMap(() => from(communityVaults)),
      map((vault: VaultSupported) =>
        VaultsActions.loadVaultById({
          txnHash: vault.txnHash,
          networkDetail: this.web3LoginService.getNetworkDetailByChainId(vault.chainId),
          rpcUrl: vault.rpcUrl
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
            action.rpcUrl,
            action.txnHash,
            action.networkDetail.chainId
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

  addTokensToVault$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VaultsActions.addTokensToVault),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter(
        (payload: [ReturnType<typeof VaultsActions.addTokensToVault>, WalletProvider | null, string | null]) =>
          payload[1] !== null && payload[2] !== null
      ),
      map(
        (payload: [ReturnType<typeof VaultsActions.addTokensToVault>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof VaultsActions.addTokensToVault>, WalletProvider, string]
      ),
      switchMap((action: [ReturnType<typeof VaultsActions.addTokensToVault>, WalletProvider, string]) => {
        return from(
          this.communityVaultsService.addTokensToVault(action[1], action[0].chainId, action[0].amount, action[2])
        ).pipe(
          map((response: IReceiptTransaction) =>
            VaultsActions.addTokensToVaultSuccess({ txnHash: response.transactionHash, chainId: action[0].chainId })
          ),
          catchError((error: string) =>
            of(VaultsActions.addTokensToVaultFailure({ message: error, chainId: action[0].chainId }))
          )
        );
      })
    );
  });
}
