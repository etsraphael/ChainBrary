import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { filter, Observable, Subscription, take } from 'rxjs';
import { IReceiptTransaction } from './../../../../../shared/interfaces';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { TransactionBridgeContract } from './../../../../../shared/contracts';
import { AuthStatusCode } from './../../../../../shared/enum';
import { loadAuth, setAuthPublicAddress } from './../../../../../store/auth-store/state/actions';
import { selectAuthStatus, selectPublicAddress } from './../../../../../store/auth-store/state/selectors';
import { generatePaymentRequest } from './../../../../../store/payment-request-store/state/actions';
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

  constructor(private route: ActivatedRoute, private store: Store, private web3LoginService: Web3LoginService) {
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
  }

  openLoginModal(): void {
    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(setAuthPublicAddress({ publicAddress: state.data?.publicAddress as string }));
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
      .subscribe((publicAddress: string | null) => {
        return contract.methods
          .transferEth(payload.to)
          .send({ from: publicAddress as string, value: String(payload.priceValue) })
          .on('transactionHash', (hash: string) => console.log(hash))
          .on('confirmation', (confirmationNumber: number, receipt: IReceiptTransaction) =>
            console.log(confirmationNumber, receipt)
          )
          .on('error', (error: Error) => console.log(error));
      });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }
}
