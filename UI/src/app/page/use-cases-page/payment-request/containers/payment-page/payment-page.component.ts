import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription, filter, take } from 'rxjs';
import { selectRecentTransactionsByComponent } from 'src/app/store/transaction-store/state/selectors';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { TransactionBridgeContract } from './../../../../../shared/contracts';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IReceiptTransaction, ITransactionCard } from './../../../../../shared/interfaces';
import { loadAuth, setAuthPublicAddress } from './../../../../../store/auth-store/state/actions';
import { selectAuthStatus, selectPublicAddress } from './../../../../../store/auth-store/state/selectors';
import {
  amountSent,
  amountSentFailure,
  amountSentSuccess,
  generatePaymentRequest
} from './../../../../../store/payment-request-store/state/actions';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';
import {
  selectCardIsLoading,
  selectPaymentRequest
} from './../../../../../store/payment-request-store/state/selectors';

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

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private web3LoginService: Web3LoginService,
    private _snackBar: MatSnackBar
  ) {
    this.setUpId();
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
  }

  openLoginModal(): void {
    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(
            setAuthPublicAddress({
              publicAddress: state.data?.publicAddress as string,
              networkId: state.data?.networkId as string,
              networkName: state.data?.networkName as string
            })
          );
          this.store.dispatch(loadAuth());
          this.web3LoginService.closeLoginModal();
          break;
      }
    });
  }

  submitPayment(payload: { priceValue: number; to: string[] }): Subscription {
    this.web3 = new Web3(window.ethereum);
    const transactionContract = new TransactionBridgeContract();
    const contract: Contract = new this.web3.eth.Contract(
      transactionContract.getAbi(),
      transactionContract.getAddress()
    );

    return this.publicAddress$
      .pipe(
        take(1),
        filter((publicAddress: string | null) => !!publicAddress)
      )
      .subscribe(async (publicAddress: string | null) => {
        const networkId: number = await this.web3.eth.net.getId();
        if (environment.networkSupported.indexOf(networkId) === -1) {
          this._snackBar.open('Network not supported', 'Close', {
            duration: 2000
          });
          return;
        }

        return contract.methods
          .transferEth(payload.to)
          .send({ from: publicAddress as string, value: String(payload.priceValue) })
          .on('transactionHash', (hash: string) => this.store.dispatch(amountSent({ hash, networkId })))
          .on('confirmation', (confirmationNumber: number, receipt: IReceiptTransaction) =>
            this.store.dispatch(
              amountSentSuccess({ hash: receipt.transactionHash, numberConfirmation: confirmationNumber })
            )
          )
          .on('error', (error: Error) => {
            this.store.dispatch(amountSentFailure({ message: error.message }));
            throw error;
          });
      });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }
}
