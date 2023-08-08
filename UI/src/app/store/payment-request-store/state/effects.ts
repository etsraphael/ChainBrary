import { Injectable } from '@angular/core';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Buffer } from 'buffer';
import { Observable, catchError, filter, from, map, of, switchMap } from 'rxjs';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { selectCurrentNetwork, selectNetworkSymbol, selectPublicAddress } from '../../auth-store/state/selectors';
import { showErrorNotification, showSuccessNotification } from '../../notification-store/state/actions';
import { TransactionBridgeContract } from './../../../shared/contracts';
import { tokenList } from './../../../shared/data/tokenList';
import { IPaymentRequest, IReceiptTransaction, IToken } from './../../../shared/interfaces';
import { PriceFeedService } from './../../../shared/services/price-feed/price-feed.service';
import * as PaymentRequestActions from './actions';
import { selectToken } from './actions';
import { selectPayment, selectPaymentToken } from './selectors';
import { TokenPair } from './../../../shared/enum';

@Injectable()
export class PaymentRequestEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private store: Store,
    private priceFeedService: PriceFeedService
  ) {}

  isIPaymentRequest(obj: IPaymentRequest): obj is IPaymentRequest {
    return (
      typeof obj === 'object' && obj !== null && typeof obj.publicAddress === 'string' && typeof obj.amount === 'number'
    );
  }

  initPaymentRequestMaker$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.initPaymentRequestMaker),
      concatLatestFrom(() => [this.store.select(selectNetworkSymbol)]),
      map((payload: [ReturnType<typeof PaymentRequestActions.initPaymentRequestMaker>, string | null]) => {
        const tokenFound: IToken | null = tokenList.find((token) => token.symbol === payload[1]) || null;
        return selectToken({ token: tokenFound });
      })
    );
  });

  applyConversionToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.applyConversionToken),
      concatLatestFrom(() => [this.store.select(selectPaymentToken), this.store.select(selectCurrentNetwork)]),
      filter(
        (
          payload: [ReturnType<typeof PaymentRequestActions.applyConversionToken>, IToken | null, INetworkDetail | null]
        ) => {
          return payload[1] !== null && payload[2] !== null;
        }
      ),
      map(
        (
          payload: [
            ReturnType<typeof PaymentRequestActions.applyConversionToken>,
            IToken | null,
            INetworkDetail | null | null
          ]
        ) => payload as [ReturnType<typeof PaymentRequestActions.applyConversionToken>, IToken | null, INetworkDetail]
      ),
      switchMap(
        async (
          payload: [ReturnType<typeof PaymentRequestActions.applyConversionToken>, IToken | null, INetworkDetail]
        ) => {
          let price: number;


          if(payload[1]?.nativeToChainId === payload[2].chainId) {
            price = await this.priceFeedService.getCurrentPriceOfNativeToken(payload[2].chainId);
          } else {
            price = await this.priceFeedService.getCurrentPrice(TokenPair.LinkToUsd, payload[2].chainId);
          }

          return PaymentRequestActions.applyConversionTokenSuccess({
            usdAmount: price * payload[0].amount,
            tokenAmount: payload[0].amount
          });
        }
      )
    );
  });

  generatePayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.generatePaymentRequest),
      map((action: ReturnType<typeof PaymentRequestActions.generatePaymentRequest>) => {
        const decodedPayment = Buffer.from(
          action.encodedRequest.replace('+', '-').replace('/', '_'),
          'base64'
        ).toString('utf-8');
        const decodedPaymentRequest: IPaymentRequest = JSON.parse(decodedPayment);
        if (this.isIPaymentRequest(decodedPaymentRequest)) {
          return PaymentRequestActions.generatePaymentRequestSuccess({
            paymentRequest: decodedPaymentRequest,
            network: this.web3LoginService.getNetworkDetailByChainId(decodedPaymentRequest.chainId)
          });
        } else {
          return PaymentRequestActions.generatePaymentRequestFailure({
            errorMessage: 'Error decoding payment request'
          });
        }
      }),
      catchError(() =>
        of(
          PaymentRequestActions.generatePaymentRequestFailure({
            errorMessage: 'Error decoding payment request'
          })
        )
      )
    );
  });

  sendAmountTransactionsError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.amountSentFailure),
      map((action: ReturnType<typeof PaymentRequestActions.amountSentFailure>) =>
        showErrorNotification({ message: action.message })
      )
    );
  });

  sendAmountTransactionsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.amountSentSuccess),
      filter((action: ReturnType<typeof PaymentRequestActions.amountSentSuccess>) => action.numberConfirmation == 1),
      map(() => showSuccessNotification({ message: 'Transaction is processing' }))
    );
  });

  transferFunds$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.sendAmount),
      concatLatestFrom(() => [this.store.select(selectPublicAddress), this.store.select(selectPayment)]),
      switchMap(
        (payload: [ReturnType<typeof PaymentRequestActions.sendAmount>, string | null, IPaymentRequest | null]) => {
          const web3: Web3 = new Web3(window.ethereum);
          const transactionContract = new TransactionBridgeContract(String(payload[2]?.chainId));
          const contract: Contract = new web3.eth.Contract(
            transactionContract.getAbi(),
            transactionContract.getAddress()
          );
          return (
            from(
              contract.methods
                .transferFund([payload[2]?.publicAddress])
                .estimateGas({ from: payload[1], value: String(payload[0].priceValue) })
            ) as Observable<number>
          ).pipe(
            switchMap((gas: number) => {
              return (
                from(
                  contract.methods
                    .transferFund([payload[2]?.publicAddress])
                    .send({ from: payload[1], value: String(payload[0].priceValue), gas: gas })
                ) as Observable<IReceiptTransaction>
              ).pipe(
                map((receipt: IReceiptTransaction) =>
                  PaymentRequestActions.amountSent({
                    hash: receipt.transactionHash,
                    chainId: payload[2]?.chainId as NetworkChainId
                  })
                ),
                catchError((error: Error) => of(PaymentRequestActions.amountSentFailure({ message: error.message })))
              );
            }),
            catchError(() => {
              return (
                from(
                  contract.methods
                    .transferFund([payload[2]?.publicAddress])
                    .send({ from: payload[1], value: String(payload[0].priceValue) })
                ) as Observable<IReceiptTransaction>
              ).pipe(
                map((receipt: IReceiptTransaction) =>
                  PaymentRequestActions.amountSent({
                    hash: receipt.transactionHash,
                    chainId: payload[2]?.chainId as NetworkChainId
                  })
                ),
                catchError((error: Error) => of(PaymentRequestActions.amountSentFailure({ message: error.message })))
              );
            })
          );
        }
      )
    );
  });
}
