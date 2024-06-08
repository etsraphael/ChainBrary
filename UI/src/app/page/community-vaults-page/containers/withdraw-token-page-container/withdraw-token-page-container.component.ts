import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subscription, combineLatest, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { communityVaults } from './../../../../data/communityVaults.data';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';
import { FullAndShortNumber, StoreState, Vault, VaultSupported } from './../../../../shared/interfaces';
import { setAuthPublicAddress } from './../../../../store/auth-store/state/actions';
import { selectBalance, selectCurrentNetwork } from './../../../../store/auth-store/state/selectors';
import { loadVaultById, withdrawTokensFromVault } from './../../../../store/vaults-store/state/actions';
import { selectVaultByChainId, selectWithdrawingErrorMessage } from './../../../../store/vaults-store/state/selectors';

@Component({
  selector: 'app-withdraw-token-page-container',
  templateUrl: './withdraw-token-page-container.component.html',
  styleUrls: ['./withdraw-token-page-container.component.scss']
})
export class WithdrawTokenPageContainerComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@CommunityVaultWithdraw.Title:Withdraw`,
    goBackLink: '/community-vaults/list',
    description: null
  };
  urlNetworkFound: INetworkDetail | null = null;

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    private web3LoginService: Web3LoginService,
    private actions$: Actions
  ) {}

  readonly userBalance$: Observable<FullAndShortNumber | null> = this.store.select(selectBalance);
  readonly currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  readonly withdrawingErrorMessage$: Observable<string | null> = this.store.select(selectWithdrawingErrorMessage);

  get vaultSelected(): Observable<StoreState<Vault | null> | null> {
    return this.route.params.pipe(
      filter((params: Params) => !!params['chainId']),
      map((params: Params) => params['chainId']),
      switchMap((chainId: string) => this.store.select(selectVaultByChainId(chainId as NetworkChainId)))
    );
  }

  get isWrongNetwork(): Observable<boolean> {
    return combineLatest([this.route.params, this.currentNetwork$]).pipe(
      filter(([params, network]: [Params, INetworkDetail | null]) => !!params && !!network),
      takeUntil(this.destroyed$),
      map(([params, network]) => params['chainId'] !== network?.chainId)
    );
  }

  ngOnInit(): void {
    this.getNetworkDetail();
    this.loadVaultSelectedIfNull();
    this.loginListener();
  }

  withdrawToken(): void {
    return this.store.dispatch(withdrawTokensFromVault({ chainId: this.route.snapshot.params['chainId'] }));
  }

  private loadVaultSelectedIfNull(): void {
    this.vaultSelected
      .pipe(
        filter((vault: StoreState<Vault | null> | null) => vault?.loading === true || !vault),
        take(1)
      )
      .subscribe(() => this.loadVaultByChainId());
  }

  private getNetworkDetail(): Subscription {
    return this.route.params
      .pipe(
        filter((params: Params) => !!params['chainId']),
        take(1)
      )
      .subscribe(
        (params: Params) => (this.urlNetworkFound = this.web3LoginService.getNetworkDetailByChainId(params['chainId']))
      );
  }

  private loginListener(): void {
    this.actions$
      .pipe(ofType(setAuthPublicAddress), takeUntil(this.destroyed$))
      .subscribe(() => this.loadVaultByChainId());
  }

  private loadVaultByChainId(): void {
    const vaultConfig: VaultSupported = communityVaults.filter(
      (vault: VaultSupported) => vault.chainId === this.route.snapshot.params['chainId']
    )[0];
    this.store.dispatch(
      loadVaultById({
        networkDetail: this.web3LoginService.getNetworkDetailByChainId(vaultConfig.chainId),
        contractAddress: vaultConfig.contractAddress,
        rpcUrl: vaultConfig.rpcUrl
      })
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
