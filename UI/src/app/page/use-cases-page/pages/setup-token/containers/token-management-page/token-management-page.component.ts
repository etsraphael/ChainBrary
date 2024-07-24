import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { selectRecentTransactionsByComponent } from 'src/app/store/transaction-store/state/selectors';
import {
  TokenActionConfirmationModalResponse,
  TokenActionModalComponent,
  TokenActionModalResponse
} from '../../components/token-action-modal/token-action-modal.component';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import {
  ActionStoreProcessing,
  ITokenSetup,
  ITransactionCard,
  KeyAndLabel,
  StoreState
} from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { selectPublicAddress } from './../../../../../../store/auth-store/state/selectors';
import {
  burnToken,
  loadBalance,
  loadTokenByTxnHash,
  mintToken,
  togglePauseToken,
  transferToken
} from './../../../../../../store/tokens-management-store/state/actions';
import {
  selectConnectedAccountIsOwner,
  selectTokenBalance,
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
      key: IOptionActionBtn.Mint,
      label: $localize`:@@btnOption:Mint`,
      disabled: true
    },
    {
      key: IOptionActionBtn.Burn,
      label: $localize`:@@btnOption:Burn`,
      disabled: true
    },
    {
      key: IOptionActionBtn.Transfer,
      label: $localize`:@@btnOption:Transfer`,
      disabled: false
    },
    {
      key: IOptionActionBtn.ChangeOwner,
      label: $localize`:@@btnOption:Change Owner`,
      disabled: true
    },
    {
      key: IOptionActionBtn.Pause,
      label: $localize`:@@btnOption:Pause`,
      disabled: true
    },
    {
      key: IOptionActionBtn.Unpause,
      label: $localize`:@@btnOption:Unpause`,
      disabled: true
    },
    {
      key: IOptionActionBtn.RenounceOwnership,
      label: $localize`:@@btnOption:Renounce Ownership`,
      disabled: true
    }
  ];

  constructor(
    public formatService: FormatService,
    private route: ActivatedRoute,
    public web3LoginService: Web3LoginService,
    private readonly store: Store,
    private dialog: MatDialog
  ) {}

  readonly tokenDetailStore$: Observable<StoreState<ITokenSetup | null>> = this.store.select(selectTokenDetail);
  readonly tokenCreationIsProcessing$: Observable<ActionStoreProcessing> = this.store.select(
    selectTokenCreationIsProcessing
  );
  readonly connectedAccountIsOwner$: Observable<boolean> = this.store.select(selectConnectedAccountIsOwner);
  readonly transactionCards$: Observable<ITransactionCard[]> = this.store.select(
    selectRecentTransactionsByComponent('TokenManagementPageComponent')
  );
  readonly addressConnected$: Observable<string | null> = this.store.select(selectPublicAddress);
  readonly tokenBalance$: Observable<StoreState<number | null>> = this.store.select(selectTokenBalance);

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

  onActionBtnClick(action: IOptionActionBtn): void {
    this.addressConnected$
      .pipe(
        take(1),
        filter((addressConnected: string | null) => addressConnected !== null),
        map((addressConnected: string | null) => addressConnected as string)
      )
      .subscribe((addressConnected: string) => {
        // load balance if needed
        if (action === IOptionActionBtn.Transfer) {
          this.store.dispatch(loadBalance());
        }

        const dialogRef: MatDialogRef<
          TokenActionModalComponent,
          TokenActionModalResponse | TokenActionConfirmationModalResponse
        > = this.dialog.open(TokenActionModalComponent, {
          panelClass: ['col-12', 'col-md-6', 'col-lg-4'],
          data: { action, addressConnected, tokenBalanceObs: this.tokenBalance$ }
        });

        dialogRef
          .afterClosed()
          .pipe(
            take(1),
            filter(
              (result: TokenActionModalResponse | TokenActionConfirmationModalResponse | undefined) =>
                result !== undefined
            )
          )
          .subscribe((result: TokenActionModalResponse | TokenActionConfirmationModalResponse | undefined) => {
            switch (action) {
              case IOptionActionBtn.Mint:
                return this.store.dispatch(
                  mintToken({
                    amount: (result as TokenActionModalResponse).amount,
                    to: (result as TokenActionModalResponse).to
                  })
                );
              case IOptionActionBtn.Burn:
                return this.store.dispatch(
                  burnToken({
                    amount: (result as TokenActionModalResponse).amount
                  })
                );
              case IOptionActionBtn.Transfer:
                return this.store.dispatch(
                  transferToken({
                    amount: (result as TokenActionModalResponse).amount,
                    to: (result as TokenActionModalResponse).to
                  })
                );
              case IOptionActionBtn.Pause: {
                return this.store.dispatch(togglePauseToken({ pause: true }));
              }
              case IOptionActionBtn.Unpause: {
                return this.store.dispatch(togglePauseToken({ pause: false }));
              }
              default:
                break;
            }
          });
      });
  }

  generateScanLink(hash: string): string {
    switch (this.chainId) {
      case NetworkChainId.ETHEREUM:
        return `https://etherscan.io/tx/${hash}`;
      case NetworkChainId.SEPOLIA:
        return `https://sepolia.etherscan.io/tx/${hash}`;
      case NetworkChainId.POLYGON:
        return `https://polygonscan.com/tx/${hash}`;
      case NetworkChainId.BNB:
        return `https://bscscan.com/tx/${hash}`;
      case NetworkChainId.AVALANCHE:
        return `https://snowtrace.io/tx/${hash}`;
      default:
        return '';
    }
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
        const tokenPaused: boolean | undefined = tokenDetail?.isPaused;

        this.optionBtns = this.optionBtns.filter(
          (btn: IOptionButton) =>
            !(tokenPaused && btn.key === IOptionActionBtn.Pause) &&
            !(!tokenPaused && btn.key === IOptionActionBtn.Unpause)
        );

        this.optionBtns = this.optionBtns.map((btn: IOptionButton) => {
          switch (btn.key) {
            case IOptionActionBtn.Mint:
              btn.disabled = (tokenDetail?.canMint === false && !connectedAccountIsOwner) || tokenPaused === true;
              break;
            case IOptionActionBtn.Burn:
              btn.disabled = (tokenDetail?.canBurn === false && !connectedAccountIsOwner) || tokenPaused === true;
              break;
            case IOptionActionBtn.Pause:
            case IOptionActionBtn.Unpause:
              btn.disabled = !tokenDetail?.canPause && !connectedAccountIsOwner;
              break;
            case IOptionActionBtn.ChangeOwner:
              btn.disabled = !connectedAccountIsOwner || tokenPaused === true;
              break;
            case IOptionActionBtn.RenounceOwnership:
              btn.disabled = !connectedAccountIsOwner || tokenPaused === true;
              break;
            case IOptionActionBtn.Transfer:
              btn.disabled = tokenPaused === true;
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
  key: IOptionActionBtn;
  disabled: boolean;
}

export enum IOptionActionBtn {
  Mint = 'Mint',
  Burn = 'Burn',
  Transfer = 'Transfer',
  ChangeOwner = 'ChangeOwner',
  Pause = 'Pause',
  Unpause = 'Unpause',
  RenounceOwnership = 'RenounceOwnership'
}
