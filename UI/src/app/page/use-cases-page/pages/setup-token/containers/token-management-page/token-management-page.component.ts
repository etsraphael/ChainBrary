import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { ActionStoreProcessing, ITokenSetup, KeyAndLabel, StoreState } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { loadTokenByTxnHash } from './../../../../../../store/tokens-management-store/state/actions';
import {
  selectConnectedAccountIsOwner,
  selectTokenCreationIsProcessing,
  selectTokenDetail
} from './../../../../../../store/tokens-management-store/state/selectors';

@Component({
  selector: 'app-token-management-page',
  templateUrl: './token-management-page.component.html',
  styleUrl: './token-management-page.component.scss'
})
export class TokenManagementPageComponent implements OnInit, OnDestroy {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@viewTokenTitle:View Token`,
    goBackLink: '/use-cases/setup-token/services',
    description: null
  };
  networkDetailSelected: INetworkDetail;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  optionBtns: IOptionButton[] = [
    {
      key: 'Mint',
      label: $localize`:@@btnOption:Mint`,
      disabled: true
    },
    {
      key: 'Burn',
      label: $localize`:@@btnOption:Burn`,
      disabled: true
    },
    {
      key: 'Transfer',
      label: $localize`:@@btnOption:Transfer`,
      disabled: false
    },
    {
      key: 'ChangeOwner',
      label: $localize`:@@btnOption:Change Owner`,
      disabled: true
    },
    {
      key: 'Pause',
      label: $localize`:@@btnOption:Pause`,
      disabled: true
    },
    {
      key: 'RenounceOwnership',
      label: $localize`:@@btnOption:Renounce Ownership`,
      disabled: true
    }
  ];

  constructor(
    public formatService: FormatService,
    private route: ActivatedRoute,
    public web3LoginService: Web3LoginService,
    private readonly store: Store
  ) {}

  readonly tokenDetailStore$: Observable<StoreState<ITokenSetup | null>> = this.store.select(selectTokenDetail);
  readonly tokenCreationIsProcessing$: Observable<ActionStoreProcessing> = this.store.select(
    selectTokenCreationIsProcessing
  );
  readonly connectedAccountIsOwner$: Observable<boolean> = this.store.select(selectConnectedAccountIsOwner);

  get tokenIsCreating$(): Observable<boolean> {
    return this.tokenCreationIsProcessing$.pipe(map((s) => s.isLoading));
  }

  get tokenIsLoading$(): Observable<boolean> {
    return this.tokenDetailStore$.pipe(map((s) => s.loading));
  }

  get tokenDetail$(): Observable<ITokenSetup | null> {
    return this.tokenDetailStore$.pipe(map((s) => s.data));
  }

  get chainId(): NetworkChainId {
    return this.route.snapshot.params['chainId'];
  }

  get txnHash(): string {
    return this.route.snapshot.params['txnHash'];
  }

  ngOnInit(): void {
    this.initNetworkDetailSelected();
    this.callActions();
    this.setUpButtonOptions();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private initNetworkDetailSelected(): void {
    this.networkDetailSelected = this.web3LoginService.getNetworkDetailByChainId(this.chainId);
  }

  private callActions(): void {
    combineLatest([this.tokenDetail$, this.tokenCreationIsProcessing$])
      .pipe(
        takeUntil(this.destroyed$),
        filter(([tokenDetail, tokenRefreshCheck]) => tokenDetail === null && tokenRefreshCheck.isLoading === false),
        take(1)
      )
      .subscribe(() => this.store.dispatch(loadTokenByTxnHash({ txHash: this.txnHash, chainId: this.chainId })));
  }

  private setUpButtonOptions(): void {
    combineLatest([this.tokenDetail$, this.connectedAccountIsOwner$])
      .pipe(
        filter(([tokenDetail]) => tokenDetail !== null),
        take(1)
      )
      .subscribe(([tokenDetail, connectedAccountIsOwner]) => {
        this.optionBtns = this.optionBtns.map((btn: IOptionButton) => {
          switch (btn.key) {
            case 'Mint':
              btn.disabled = tokenDetail?.canMint === false && !connectedAccountIsOwner;
              break;
            case 'Burn':
              btn.disabled = tokenDetail?.canBurn === false && !connectedAccountIsOwner;
              break;
            case 'Pause':
              btn.disabled = !tokenDetail?.canPause && !connectedAccountIsOwner;
              break;
            case 'ChangeOwner':
              btn.disabled = !connectedAccountIsOwner;
              break;
            case 'RenounceOwnership':
              btn.disabled = !connectedAccountIsOwner;
              break;
            default:
              break;
          }
          return btn;
        });
      });
  }
}

interface IOptionButton extends KeyAndLabel {
  disabled: boolean;
}
