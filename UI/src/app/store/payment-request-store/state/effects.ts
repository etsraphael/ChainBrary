import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IEditAllowancePayload } from '@chainbrary/token-bridge';
import { INetworkDetail, NetworkChainId, WalletProvider } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { TransactionReceipt } from 'web3';
import { selectCurrentNetwork, selectNetworkSymbol, selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { showErrorNotification, showSuccessNotification } from '../../notification-store/state/actions';
import { TransactionBridgeContract } from './../../../shared/contracts';
import { tokenList } from './../../../shared/data/tokenList';
import {
  IPaymentRequest,
  IReceiptTransaction,
  IToken,
  ITokenContract,
  PaymentTypes,
  SendNativeTokenPayload,
  SendTransactionTokenBridgePayload,
  StoreState,
  TransactionTokenBridgePayload
} from './../../../shared/interfaces';
import { PriceFeedService } from './../../../shared/services/price-feed/price-feed.service';
import { TokensService } from './../../../shared/services/tokens/tokens.service';
import { WalletService } from './../../../shared/services/wallet/wallet.service';
import * as PaymentRequestActions from './actions';
import {
  DataConversionStore,
  selectConversionToken,
  selectIsNonNativeToken,
  selectPaymentConversion,
  selectPaymentNetworkIsMathing,
  selectPaymentRequestDetail,
  selectPaymentToken
} from './selectors';

@Injectable()
export class PaymentRequestEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private priceFeedService: PriceFeedService,
    private walletService: WalletService,
    private tokensService: TokensService,
    private router: Router
  ) {}

  private isRawIPaymentRequestDetail(obj: IPaymentRequest): obj is IPaymentRequest {
    return (
      typeof obj === 'object' && obj !== null && typeof obj.publicAddress === 'string' && typeof obj.name === 'string'
    );
  }

  initPaymentRequestMaker$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.initPaymentRequestMaker),
      concatLatestFrom(() => [this.store.select(selectNetworkSymbol)]),
      map((payload: [ReturnType<typeof PaymentRequestActions.initPaymentRequestMaker>, string | null]) => {
        const tokenFound: IToken | null = tokenList.find((token) => token.symbol === payload[1]) || null;
        return PaymentRequestActions.selectToken({ token: tokenFound });
      })
    );
  });

  checkIfTransferIsPossibleAfterManually$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.smartContractCanTransfer),
      concatLatestFrom(() => [
        this.store.select(selectPublicAddress),
        this.store.select(selectIsNonNativeToken),
        this.store.select(selectPaymentNetworkIsMathing),
        this.store.select(selectPaymentRequestDetail)
      ]),
      filter(
        (
          payload: [
            ReturnType<typeof PaymentRequestActions.smartContractCanTransfer>,
            string | null,
            boolean,
            boolean,
            StoreState<IPaymentRequest | null>
          ]
        ) => payload[1] !== null && payload[3] && payload[4] !== null
      ),
      map(
        (payload) =>
          payload as [
            ReturnType<typeof PaymentRequestActions.smartContractCanTransfer>,
            string,
            boolean,
            boolean,
            StoreState<IPaymentRequest | null>
          ]
      ),
      switchMap(
        async (
          action: [
            ReturnType<typeof PaymentRequestActions.smartContractCanTransfer>,
            string,
            boolean,
            boolean,
            StoreState<IPaymentRequest | null>
          ]
        ) => {
          if (action[2] === false) {
            return PaymentRequestActions.smartContractCanTransferSuccess({ isTransferable: true });
          }

          const tokenAddress: ITokenContract | undefined = tokenList
            .find((token) => token.tokenId === (action[4]?.data as IPaymentRequest).tokenId)
            ?.networkSupport.find((support) => support.chainId === (action[4]?.data as IPaymentRequest).chainId);

          if (!tokenAddress) {
            return PaymentRequestActions.smartContractCanTransferFailure({
              message: $localize`:@@ResponseMessage.TokenAddressNotFound:Token address not found!`
            });
          }

          const payload: TransactionTokenBridgePayload = {
            ownerAdress: action[1],
            tokenAddress: tokenAddress.address,
            chainId: (action[4]?.data as IPaymentRequest).chainId,
            amount: (action[4]?.data as IPaymentRequest).amount as number
          };

          return this.tokensService
            .getTransferAvailable(payload)
            .then((isTransferable: boolean) =>
              PaymentRequestActions.smartContractCanTransferSuccess({ isTransferable })
            );
        }
      ),
      catchError((error: string) => {
        return of(PaymentRequestActions.smartContractCanTransferFailure({ message: error }));
      })
    );
  });

  checkIfTransferIsPossibleAfterAllowance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.approveTokenAllowanceSuccess),
      concatLatestFrom(() => [this.store.select(selectPublicAddress), this.store.select(selectPaymentRequestDetail)]),
      filter(
        (
          payload: [
            ReturnType<typeof PaymentRequestActions.approveTokenAllowanceSuccess>,
            string | null,
            StoreState<IPaymentRequest | null>
          ]
        ) => payload[1] !== null && payload[2] !== null
      ),
      map(
        (payload) =>
          payload as [
            ReturnType<typeof PaymentRequestActions.approveTokenAllowanceSuccess>,
            string,
            StoreState<IPaymentRequest | null>
          ]
      ),
      switchMap(
        async (
          action: [
            ReturnType<typeof PaymentRequestActions.approveTokenAllowanceSuccess>,
            string,
            StoreState<IPaymentRequest | null>
          ]
        ) => {
          const tokenAddress: string = tokenList
            .find((token) => token.tokenId === (action[2]?.data as IPaymentRequest).tokenId)
            ?.networkSupport.find((support) => support.chainId === (action[2]?.data as IPaymentRequest).chainId)
            ?.address as string;
          const payload: TransactionTokenBridgePayload = {
            ownerAdress: action[1],
            tokenAddress: tokenAddress,
            chainId: (action[2]?.data as IPaymentRequest).chainId,
            amount: (action[2]?.data as IPaymentRequest).amount as number
          };
          return this.tokensService
            .getTransferAvailable(payload)
            .then((isTransferable: boolean) =>
              PaymentRequestActions.smartContractCanTransferSuccess({ isTransferable })
            );
        }
      )
    );
  });

  approveTokenAllowance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.approveTokenAllowance),
      concatLatestFrom(() => [this.store.select(selectPublicAddress), this.store.select(selectPaymentRequestDetail)]),
      map(
        (payload) =>
          payload as [
            ReturnType<typeof PaymentRequestActions.approveTokenAllowance>,
            string,
            StoreState<IPaymentRequest | null>
          ]
      ),
      mergeMap(([, publicAddress, payment]) => {
        const tokenAddress: string = tokenList
          .find((token) => token.tokenId === (payment.data as IPaymentRequest).tokenId)
          ?.networkSupport.find((support) => support.chainId === (payment.data as IPaymentRequest).chainId)
          ?.address as string;

        const payload: IEditAllowancePayload = {
          tokenAddress: tokenAddress,
          chainId: (payment.data as IPaymentRequest).chainId,
          owner: publicAddress,
          spender: new TransactionBridgeContract((payment.data as IPaymentRequest).chainId).getAddress(),
          amount: (payment.data as IPaymentRequest).amount as number
        };

        return from(this.tokensService.approve(payload)).pipe(
          map((result: boolean) =>
            result
              ? PaymentRequestActions.approveTokenAllowanceSuccess()
              : PaymentRequestActions.approveTokenAllowanceFailure({
                  errorMessage: $localize`:@@ResponseMessage.ErrorApprovingToken:Error approving token`
                })
          ),
          catchError((error: Error) =>
            of(PaymentRequestActions.approveTokenAllowanceFailure({ errorMessage: error.message }))
          )
        );
      })
    );
  });

  applyConversionToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.applyConversionToken),
      concatLatestFrom(() => [
        this.store.select(selectPaymentToken),
        this.store.select(selectCurrentNetwork),
        this.store.select(selectWalletConnected)
      ]),
      filter((payload) => payload[1] !== null && payload[3] !== null),
      map(
        (
          payload: [
            ReturnType<typeof PaymentRequestActions.applyConversionToken>,
            IToken | null,
            INetworkDetail | null,
            WalletProvider | null
          ]
        ) =>
          payload as [
            ReturnType<typeof PaymentRequestActions.applyConversionToken>,
            IToken | null,
            INetworkDetail,
            WalletProvider
          ]
      ),
      switchMap(
        async (
          payload: [
            ReturnType<typeof PaymentRequestActions.applyConversionToken>,
            IToken | null,
            INetworkDetail,
            WalletProvider
          ]
        ) => {
          let price: number;
          const tokenFound: IToken = tokenList.find(
            (token) => token.nativeToChainId === payload[1]?.nativeToChainId && token.tokenId === payload[1]?.tokenId
          ) as IToken;

          // If the token is the native token of the network, we get the price of the native token
          if (tokenFound?.nativeToChainId === payload[2].chainId) {
            price = await this.priceFeedService.getCurrentPriceOfNativeToken(payload[2].chainId, payload[3]);
          } else {
            const priceFeed = tokenFound?.networkSupport.find(
              (network: ITokenContract) => network.chainId === payload[2].chainId
            )?.priceFeed[0];

            // If the token is not supported by the network, we return 0
            if (priceFeed === undefined) {
              return PaymentRequestActions.applyConversionNotSupported({ amountInToken: payload[0].amount });
            }
            // If the token is supported by the network, we get the price of the token
            price = await this.priceFeedService.getCurrentPrice(priceFeed, payload[2].chainId, payload[3]);
          }

          // Set up the price based on USD
          if (payload[0].amountInUsd) {
            return PaymentRequestActions.applyConversionTokenSuccess({
              usdAmount: payload[0].amount,
              tokenAmount: parseFloat((payload[0].amount / price).toFixed(12)),
              amountInUsd: payload[0].amountInUsd
            });
          }
          // Set up the price based on the token
          else
            return PaymentRequestActions.applyConversionTokenSuccess({
              usdAmount: price * payload[0].amount,
              tokenAmount: payload[0].amount,
              amountInUsd: payload[0].amountInUsd
            });
        }
      ),
      catchError(() =>
        of(
          PaymentRequestActions.applyConversionTokenFailure({
            errorMessage: $localize`:@@ResponseMessage.ErrorRetreivingDataFromTheBlockchain:Error retreiving data from the blockchain`,
            amountInUsd: false
          })
        )
      )
    );
  });

  tokenChoiceUpdated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.updatedToken),
      concatLatestFrom(() => [this.store.select(selectPaymentConversion)]),
      filter((payload) => payload[1].conversionToken.data !== null),
      map((payload: [ReturnType<typeof PaymentRequestActions.updatedToken>, DataConversionStore]) => {
        return PaymentRequestActions.applyConversionToken({
          amount: payload[1].conversionToken?.data ?? 0,
          amountInUsd: false
        });
      })
    );
  });

  generatePayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.decryptRawPaymentRequest),
      map((action: ReturnType<typeof PaymentRequestActions.decryptRawPaymentRequest>) => {
        const decodedPayment: string = atob(action.encodedRequest).replace('+', '-').replace('/', '_');
        const decodedPaymentRequest: IPaymentRequest = JSON.parse(decodedPayment);

        const completePaymentRequest: IPaymentRequest = {
          publicAddress: decodedPaymentRequest.publicAddress,
          name: decodedPaymentRequest.name,
          chainId: (decodedPaymentRequest as IPaymentRequest).chainId || null,
          tokenId: (decodedPaymentRequest as IPaymentRequest).tokenId || null,
          amount: (decodedPaymentRequest as IPaymentRequest).amount || null,
          usdEnabled: (decodedPaymentRequest as IPaymentRequest).usdEnabled || false
        };

        if (this.isRawIPaymentRequestDetail(decodedPaymentRequest)) {
          return PaymentRequestActions.decryptRawPaymentRequestSuccess({
            requestDetail: completePaymentRequest
          });
        } else {
          return PaymentRequestActions.decryptRawPaymentRequestFailure({
            errorMessage: $localize`:@@ResponseMessage.ErrorDecodingPaymentRequest:Error decoding payment request`
          });
        }
      }),
      catchError(() =>
        of(
          PaymentRequestActions.decryptRawPaymentRequestFailure({
            errorMessage: $localize`:@@ResponseMessage.ErrorDecodingPaymentRequest:Error decoding payment request`
          })
        )
      )
    );
  });

  redirectionToNotFound$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PaymentRequestActions.decryptRawPaymentRequestFailure),
        map(() => this.router.navigate(['/payment-not-found']))
      );
    },
    { dispatch: false }
  );

  sendAmountTransactionsError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.amountSentFailure, PaymentRequestActions.smartContractCanTransferFailure),
      map(
        (
          action: ReturnType<
            | typeof PaymentRequestActions.amountSentFailure
            | typeof PaymentRequestActions.smartContractCanTransferFailure
          >
        ) => showErrorNotification({ message: action.message })
      )
    );
  });

  sendAmountTransactionsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.amountSentSuccess),
      filter((action: ReturnType<typeof PaymentRequestActions.amountSentSuccess>) => action.numberConfirmation == 1),
      map(() =>
        showSuccessNotification({
          message: $localize`:@@ResponseMessage.TransactionIsProcessing:Transaction is processing`
        })
      )
    );
  });

  sendNonNativeTokenWithFees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.sendAmount),
      concatLatestFrom(() => [
        this.store.select(selectPublicAddress),
        this.store.select(selectPaymentRequestDetail),
        this.store.select(selectIsNonNativeToken)
      ]),
      filter((payload) => payload[1] !== null && payload[3] && payload[2]?.data?.usdEnabled === true),
      map(
        (payload) =>
          payload as [
            ReturnType<typeof PaymentRequestActions.sendAmount>,
            string,
            StoreState<IPaymentRequest | null>,
            boolean
          ]
      ),
      switchMap(
        (
          action: [
            ReturnType<typeof PaymentRequestActions.sendAmount>,
            string,
            StoreState<IPaymentRequest | null>,
            boolean
          ]
        ) => {
          const tokenAddress: string = tokenList
            .find((token) => token.tokenId === action[2].data?.tokenId)
            ?.networkSupport.find((support) => support.chainId === action[2].data?.chainId)?.address as string;
          const payload: SendTransactionTokenBridgePayload = {
            tokenAddress: tokenAddress,
            chainId: (action[2].data as IPaymentRequest).chainId,
            amount: (action[2].data as IPaymentRequest).amount as number,
            ownerAdress: action[1],
            destinationAddress: (action[2].data as IPaymentRequest).publicAddress
          };
          return from(this.tokensService.transferNonNativeTokenSC(payload)).pipe(
            map((receipt: IReceiptTransaction) =>
              PaymentRequestActions.amountSent({
                hash: receipt.transactionHash,
                chainId: (action[2].data as IPaymentRequest).chainId as NetworkChainId
              })
            ),
            catchError((error: { message: string; code: number }) =>
              of(
                PaymentRequestActions.amountSentFailure({
                  message: this.walletService.formatErrorMessage((error as { code: number }).code)
                })
              )
            )
          );
        }
      )
    );
  });

  sendNativeTokenWithFees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.sendAmount),
      concatLatestFrom(() => [
        this.store.select(selectPublicAddress),
        this.store.select(selectPaymentRequestDetail),
        this.store.select(selectIsNonNativeToken)
      ]),
      filter((payload) => !payload[3] && payload[2]?.data?.usdEnabled === true),
      switchMap(
        (
          action: [
            ReturnType<typeof PaymentRequestActions.sendAmount>,
            string | null,
            StoreState<IPaymentRequest | null>,
            boolean
          ]
        ) => {
          const payload: SendNativeTokenPayload = {
            to: action[2]?.data?.publicAddress as string,
            amount: Number(action[0].priceValue),
            chainId: action[2]?.data?.chainId as NetworkChainId,
            from: action[1] as string
          };
          return from(this.tokensService.transferNativeTokenSC(payload)).pipe(
            map((receipt: IReceiptTransaction) =>
              PaymentRequestActions.amountSent({
                hash: receipt.transactionHash,
                chainId: action[2]?.data?.chainId as NetworkChainId
              })
            ),
            catchError((error: { message: string; code: number }) =>
              of(
                PaymentRequestActions.amountSentFailure({
                  message: this.walletService.formatErrorMessage((error as { code: number }).code)
                })
              )
            )
          );
        }
      )
    );
  });

  sendNativeTokenWithoutFees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.sendAmount),
      concatLatestFrom(() => [
        this.store.select(selectPublicAddress),
        this.store.select(selectPaymentRequestDetail),
        this.store.select(selectIsNonNativeToken)
      ]),
      filter((payload) => !payload[3] && payload[2]?.data?.usdEnabled === false),
      switchMap(
        (
          action: [
            ReturnType<typeof PaymentRequestActions.sendAmount>,
            string | null,
            StoreState<IPaymentRequest | null>,
            boolean
          ]
        ) => {
          const payload: SendNativeTokenPayload = {
            to: action[2]?.data?.publicAddress as string,
            amount: Number(action[0].priceValue),
            chainId: action[2]?.data?.chainId as NetworkChainId,
            from: action[1] as string
          };
          return from(this.tokensService.transferNativeToken(payload)).pipe(
            map((receipt: TransactionReceipt) =>
              PaymentRequestActions.amountSent({
                hash: String(receipt.transactionHash),
                chainId: action[2]?.data?.chainId as NetworkChainId
              })
            ),
            catchError((error: { message: string; code: number }) =>
              of(
                PaymentRequestActions.amountSentFailure({
                  message: this.walletService.formatErrorMessage((error as { code: number }).code)
                })
              )
            )
          );
        }
      )
    );
  });

  sendNonNativeTokenWithoutFees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.sendAmount),
      concatLatestFrom(() => [
        this.store.select(selectPublicAddress),
        this.store.select(selectPaymentRequestDetail),
        this.store.select(selectIsNonNativeToken)
      ]),
      filter((payload) => payload[1] !== null && payload[3] && payload[2]?.data?.usdEnabled === false),
      map(
        (payload) =>
          payload as [
            ReturnType<typeof PaymentRequestActions.sendAmount>,
            string,
            StoreState<IPaymentRequest | null>,
            boolean
          ]
      ),
      switchMap(
        (
          action: [
            ReturnType<typeof PaymentRequestActions.sendAmount>,
            string,
            StoreState<IPaymentRequest | null>,
            boolean
          ]
        ) => {
          const tokenAddress: string = tokenList
            .find((token) => token.tokenId === action[2]?.data?.tokenId)
            ?.networkSupport.find((support) => support.chainId === action[2].data?.chainId)?.address as string;
          const payload: SendTransactionTokenBridgePayload = {
            tokenAddress: tokenAddress,
            chainId: (action[2]?.data as IPaymentRequest).chainId,
            amount: (action[2]?.data as IPaymentRequest).amount as number,
            ownerAdress: action[1],
            destinationAddress: (action[2]?.data as IPaymentRequest)?.publicAddress
          };
          return from(this.tokensService.transferNonNativeToken(payload)).pipe(
            map((receipt: TransactionReceipt) =>
              PaymentRequestActions.amountSent({
                hash: String(receipt.transactionHash),
                chainId: (action[2]?.data as IPaymentRequest)?.chainId
              })
            ),
            catchError((error: { message: string; code: number }) =>
              of(
                PaymentRequestActions.amountSentFailure({
                  message: this.walletService.formatErrorMessage((error as { code: number }).code)
                })
              )
            )
          );
        }
      )
    );
  });

  applyConversionTokenFromNode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.applyConversionTokenFromPayNow),
      switchMap(async (payload: ReturnType<typeof PaymentRequestActions.applyConversionTokenFromPayNow>) => {
        let price: number;

        if (payload.pair) {
          price = await this.priceFeedService.getCurrentPriceFromNode(payload.pair, payload.chainId);
        } else {
          price = await this.priceFeedService.getCurrentPriceOfNativeTokenFromNode(payload.chainId);
        }

        return PaymentRequestActions.applyConversionTokenFromPayNowSuccess({
          result:
            payload.paymentType === PaymentTypes.TOKEN
              ? price * payload.amount
              : parseFloat((payload.amount / price).toFixed(12)),
          paymentType: payload.paymentType
        });
      }),
      catchError(() =>
        of(
          PaymentRequestActions.applyConversionTokenFromPayNowFailure({
            errorMessage: $localize`:@@ResponseMessage.ErrorRetreivingDataFromTheBlockchain:Error retreiving data from the blockchain`
          })
        )
      )
    );
  });

  processPayNowPaymentNative$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.payNowTransaction),
      concatLatestFrom(() => [
        this.store.select(selectPaymentRequestDetail),
        this.store.select(selectConversionToken),
        this.store.select(selectPublicAddress)
      ]),
      filter((payload) => !!payload[1]?.data?.publicAddress && !!payload[3] && !!payload[0].token.nativeToChainId),
      switchMap(
        (
          action: [
            ReturnType<typeof PaymentRequestActions.payNowTransaction>,
            StoreState<IPaymentRequest | null>,
            StoreState<number | null>,
            string | null
          ]
        ) => {
          const amountToPay: number = action[0].lockInUSD ? Number(action[2].data) : action[0].amount;

          const payload: SendNativeTokenPayload = {
            to: action[1]?.data?.publicAddress as string,
            amount: amountToPay * 10 ** action[0].token.decimals,
            chainId: action[0].chainId,
            from: action[3] as string
          };

          return from(this.tokensService.transferNativeToken(payload)).pipe(
            map((receipt: TransactionReceipt) =>
              PaymentRequestActions.payNowTransactionSuccess({
                transactionHash: String(receipt.transactionHash),
                chainId: action[0].chainId as NetworkChainId,
                amount: Number(action[2].data),
                token: action[0].token
              })
            ),
            catchError((error: { message: string; code: number }) =>
              of(
                PaymentRequestActions.payNowTransactionFailure({
                  errorMessage: this.walletService.formatErrorMessage((error as { code: number }).code)
                }),
                showErrorNotification({
                  message: this.walletService.formatErrorMessage((error as { code: number }).code)
                })
              )
            )
          );
        }
      )
    );
  });

  processPayNowPaymentNonNative$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.payNowTransaction),
      concatLatestFrom(() => [
        this.store.select(selectPaymentRequestDetail),
        this.store.select(selectConversionToken),
        this.store.select(selectPublicAddress)
      ]),
      filter((payload) => !!payload[1]?.data?.publicAddress && !!payload[3] && !payload[0].token.nativeToChainId),
      switchMap(
        (
          action: [
            ReturnType<typeof PaymentRequestActions.payNowTransaction>,
            StoreState<IPaymentRequest | null>,
            StoreState<number | null>,
            string | null
          ]
        ) => {
          const tokenAddress: string = action[0].token.networkSupport.find(
            (support) => support.chainId === action[0].chainId
          )?.address as string;

          const amountToPay: number = action[0].lockInUSD ? Number(action[2].data) : action[0].amount;

          const payload: SendTransactionTokenBridgePayload = {
            destinationAddress: action[1].data?.publicAddress as string,
            amount: amountToPay * 10 ** action[0].token.decimals,
            chainId: action[0].chainId,
            ownerAdress: action[3] as string,
            tokenAddress: tokenAddress
          };

          return from(this.tokensService.transferNonNativeTokenForPayNow(payload)).pipe(
            map((receipt: TransactionReceipt) =>
              PaymentRequestActions.payNowTransactionSuccess({
                transactionHash: String(receipt.transactionHash),
                chainId: action[0].chainId as NetworkChainId,
                amount: amountToPay * 10 ** action[0].token.decimals,
                token: action[0].token
              })
            ),
            catchError((error: { message: string; code: number }) =>
              of(
                PaymentRequestActions.payNowTransactionFailure({
                  errorMessage: this.walletService.formatErrorMessage((error as { code: number }).code)
                }),
                showErrorNotification({
                  message: this.walletService.formatErrorMessage((error as { code: number }).code)
                })
              )
            )
          );
        }
      )
    );
  });

  payNowTransactionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.payNowTransactionSuccess),
      tap((action: ReturnType<typeof PaymentRequestActions.payNowTransactionSuccess>) =>
        this.router.navigate(['/successful-payment'], {
          queryParams: {
            hash: action.transactionHash,
            amount: action.amount,
            currency: action.token.symbol,
            network: action.chainId
          }
        })
      ),
      map(() =>
        showSuccessNotification({
          message: $localize`:@@ResponseMessage.TransactionIsProcessing:Transaction is processing`
        })
      )
    );
  });
}
