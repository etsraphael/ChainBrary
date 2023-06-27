import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { IModalState, INetworkDetail, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest, filter, map, take } from 'rxjs';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { environment } from './../../../../../../environments/environment';
import { TransactionBridgeContract } from './../../../../../shared/contracts';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IReceiptTransaction, ITransactionCard } from './../../../../../shared/interfaces';
import { loadAuth, setAuthPublicAddress } from './../../../../../store/auth-store/state/actions';
import {
  selectAuthStatus,
  selectCurrentNetwork,
  selectPublicAddress
} from './../../../../../store/auth-store/state/selectors';
import {
  amountSent,
  amountSentFailure,
  generatePaymentRequest
} from './../../../../../store/payment-request-store/state/actions';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';
import {
  selectCardIsLoading,
  selectPaymentNetwork,
  selectPaymentRequest
} from './../../../../../store/payment-request-store/state/selectors';
import { selectRecentTransactionsByComponent } from './../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  AuthStatusCodeTypes = AuthStatusCode;
  selectPaymentRequestState$: Observable<IPaymentRequestState>;
  cardIsLoading$: Observable<boolean>;
  modalSub: Subscription;
  authStatus$: Observable<AuthStatusCode>;
  publicAddress$: Observable<string | null>;
  web3: Web3;
  transactionCards$: Observable<ITransactionCard[]>;
  currentNetwork$: Observable<INetworkDetail | null>;
  paymentNetwork$: Observable<INetworkDetail | null>;
  walletInProcess = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private web3LoginService: Web3LoginService,
    private _snackBar: MatSnackBar
  ) {
    this.setUpId();
  }

  get paymentSelectedInvalid$(): Observable<boolean> {
    return combineLatest([this.currentNetwork$, this.paymentNetwork$]).pipe(
      map(([currentNetwork, paymentNetwork]) => {
        if (!currentNetwork || !paymentNetwork) {
          return false;
        }
        return currentNetwork.chainId !== paymentNetwork.chainId;
      })
    );
  }

  setUpId(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.store.dispatch(generatePaymentRequest({ encodedRequest: params['id'] }));
      }
    });
  }

  ngOnInit(): void {
    this.generateObs();
  }

  generateObs(): void {
    this.selectPaymentRequestState$ = this.store.select(selectPaymentRequest);
    this.cardIsLoading$ = this.store.select(selectCardIsLoading);
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.transactionCards$ = this.store.select(selectRecentTransactionsByComponent('PaymentPageComponent'));
    this.currentNetwork$ = this.store.select(selectCurrentNetwork);
    this.paymentNetwork$ = this.store.select(selectPaymentNetwork);
  }

  openLoginModal(): void {
    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: IModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(
            setAuthPublicAddress({
              publicAddress: state.data?.publicAddress as string,
              network: state.data?.network as INetworkDetail
            })
          );
          this.store.dispatch(loadAuth());
          this.web3LoginService.closeLoginModal();
          break;
      }
    });
  }

  submitPayment(payload: { priceValue: number; to: string[] }): Subscription | void {
    this.web3 = new Web3(window.ethereum);

    return combineLatest([this.publicAddress$, this.web3LoginService.currentNetwork$])
      .pipe(
        take(1),
        filter(([publicAddress, network]: [string | null, INetworkDetail | null]) => !!publicAddress && !!network),
        map(
          ([publicAddress, network]: [string | null, INetworkDetail | null]) =>
            [publicAddress as string, network as INetworkDetail] as (string | INetworkDetail)[]
        )
      )
      .subscribe((result: (string | INetworkDetail)[]) => {
        const [publicAddress, network] = result as [string, INetworkDetail];

        if (!environment.networkSupported.includes(network.chainId)) {
          this._snackBar.open('Network not supported', 'Close', {
            duration: 2000
          });
          return;
        }

        const transactionContract = new TransactionBridgeContract(network.chainId);
        const contract: Contract = new this.web3.eth.Contract(
          transactionContract.getAbi(),
          transactionContract.getAddress()
        );

        return contract.methods
          .transferFund(payload.to)
          .estimateGas({ from: publicAddress, value: String(payload.priceValue) })
          .then((gas: number) => {
            this.walletInProcess = true;
            return contract.methods
              .transferFund(payload.to)
              .send({ from: publicAddress as string, value: String(payload.priceValue), gas: gas })
              .then((receipt: IReceiptTransaction) =>
                this.store.dispatch(amountSent({ hash: receipt.transactionHash, chainId: Number(network.chainId) }))
              )
              .catch((error: Error) => this.store.dispatch(amountSentFailure({ message: error.message })))
              .finally(() => (this.walletInProcess = false));
          });
      });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }
}
