import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subscription, combineLatest, filter, map, take, takeUntil } from 'rxjs';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';
import { FullAndShortNumber } from './../../../../shared/interfaces';
import { selectBalance, selectCurrentNetwork } from './../../../../store/auth-store/state/selectors';
import { addTokensToVault } from './../../../../store/vaults-store/state/actions';

@Component({
  selector: 'app-add-token-page-container',
  templateUrl: './add-token-page-container.component.html',
  styleUrls: ['./add-token-page-container.component.scss']
})
export class AddTokenPageContainerComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headerPayload: IHeaderBodyPage = {
    title: `Community Vault`,
    goBackLink: '/community-vaults/list',
    description: null
  };
  urlNetworkFound: INetworkDetail | null = null;

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    private web3LoginService: Web3LoginService
  ) {}

  readonly userBalance$: Observable<FullAndShortNumber | null> = this.store.select(selectBalance);
  readonly currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);

  get isWrongNetwork(): Observable<boolean> {
    return combineLatest([this.route.params, this.currentNetwork$]).pipe(
      filter(([params, network]: [Params, INetworkDetail | null]) => !!params && !!network),
      takeUntil(this.destroyed$),
      map(([params, network]) => {
        return params['chainId'] !== network?.chainId;
      })
    );
  }

  ngOnInit(): void {
    this.getNetworkDetail();
  }

  getNetworkDetail(): Subscription {
    return this.route.params
      .pipe(
        filter((params: Params) => !!params['chainId']),
        take(1)
      )
      .subscribe(
        (params: Params) => (this.urlNetworkFound = this.web3LoginService.getNetworkDetailByChainId(params['chainId']))
      );
  }

  addTokenToVault(amount: number): void {
    return this.store.dispatch(addTokensToVault({ amount, chainId: (this.urlNetworkFound as INetworkDetail).chainId }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
