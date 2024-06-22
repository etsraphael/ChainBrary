import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { INetworkDetail, WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, delay, filter, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AbiFragment } from 'web3';
import { Contract } from 'web3-eth-contract';
import { environment } from '../../../../environments/environment';
import { IDocumentLockerResponse, IReceiptTransaction, KeyAndLabel, StoreState } from '../../../shared/interfaces';
import { DocumentLockerService } from '../../../shared/services/document-locker/document-locker.service';
import { selectCurrentNetwork, selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import * as DLActions from './actions';
import { selectDocumentLockerRefreshCheck, selectSearchDocumentLockedData } from './selectors';

@Injectable()
export class DocumentLockerEffects {
  readonly errorMessage: KeyAndLabel[] = [
    { key: 'not_enough_funds', label: $localize`:@@documentLockerErrors.notEnoughFunds:Not enough funds` },
    { key: 'calculation_error', label: $localize`:@@documentLockerErrors.calculationError:Calculation error` },
    { key: 'no_access', label: $localize`:@@documentLockerErrors.noAccess:No access` },
    { key: 'not_found', label: $localize`:@@documentLockerErrors.notFound:Not found` }
  ];

  constructor(
    private readonly store: Store,
    private actions$: Actions,
    private DLService: DocumentLockerService,
    private snackBar: MatSnackBar,
    private router: Router,
    private web3LoginService: Web3LoginService
  ) {}

  createDocumentLocker$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.createDocumentLocker),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof DLActions.createDocumentLocker>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DLActions.createDocumentLocker>, WalletProvider, string]
      ),
      switchMap((action: [ReturnType<typeof DLActions.createDocumentLocker>, WalletProvider, string]) => {
        return from(this.DLService.deployDocumentLockerContract(action[1], action[2], action[0].payload)).pipe(
          map((response: { contract: Contract<AbiFragment[]>; transactionHash: string }) =>
            DLActions.documentLockerChecking({ txn: response.transactionHash })
          ),
          tap((action: ReturnType<typeof DLActions.documentLockerChecking>) => {
            this.router.navigate(['/use-cases/document-locker/id/', action.txn]);
          }),
          catchError(() =>
            of(
              DLActions.createDocumentLockerFailure({
                message: $localize`:@@documentLockerErrors.contractCreationError:An error has occurred with your wallet. Please ensure that you are using the correct address and network. Additionally, verify that you have sufficient funds available for the document deployment on the blockchain.`
              })
            )
          )
        );
      })
    );
  });

  documentLockerChecking$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.documentLockerChecking),
      concatLatestFrom(() => [
        this.store.select(selectCurrentNetwork),
        this.store.select(selectWalletConnected),
        this.store.select(selectDocumentLockerRefreshCheck)
      ]),
      filter(
        (payload) =>
          payload[1] !== null &&
          payload[2] !== null &&
          payload[3].data.attempt <= environment.contracts.documentLocker.maxAttempt
      ),
      delay(environment.contracts.documentLocker.attemptTimeout * 1000 * 60),
      map(
        (
          payload: [
            ReturnType<typeof DLActions.documentLockerChecking>,
            INetworkDetail | null,
            WalletProvider | null,
            StoreState<{ attempt: number }>
          ]
        ) =>
          payload as [
            ReturnType<typeof DLActions.documentLockerChecking>,
            INetworkDetail,
            WalletProvider,
            StoreState<{ attempt: number }>
          ]
      ),
      switchMap(
        (
          action: [
            ReturnType<typeof DLActions.documentLockerChecking>,
            INetworkDetail,
            WalletProvider,
            StoreState<{ attempt: number }>
          ]
        ) => {
          return from(this.DLService.getDocumentLockerFromTxnHash(action[2], action[0].txn)).pipe(
            map((response: IDocumentLockerResponse) =>
              DLActions.documentLockerCheckingSuccess({ payload: response, txn: action[0].txn })
            ),
            catchError((error: { message: string }) =>
              of(DLActions.documentLockerCheckingFailure({ message: error.message, txn: action[0].txn }))
            )
          );
        }
      )
    );
  });

  documentLockerCheckingFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.documentLockerCheckingFailure),
      concatLatestFrom(() => [this.store.select(selectDocumentLockerRefreshCheck)]),
      map((payload: [ReturnType<typeof DLActions.documentLockerCheckingFailure>, StoreState<{ attempt: number }>]) => {
        if (payload[1].data.attempt > environment.contracts.documentLocker.maxAttempt) {
          return DLActions.documentLockerCheckingEnd();
        } else {
          return DLActions.documentLockerChecking({ txn: payload[0].txn });
        }
      })
    );
  });

  documentLockerCheckingSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.documentLockerCheckingSuccess),
      mergeMap((response: ReturnType<typeof DLActions.documentLockerCheckingSuccess>) => [
        DLActions.getDocumentLockerByTxnSuccess({ payload: response.payload }),
        DLActions.documentLockerRefreshCheck()
      ])
    );
  });

  getDocumentLockerByTxn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.getDocumentLockerByTxn),
      concatLatestFrom(() => [this.store.select(selectCurrentNetwork), this.store.select(selectWalletConnected)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (
          payload: [ReturnType<typeof DLActions.getDocumentLockerByTxn>, INetworkDetail | null, WalletProvider | null]
        ) => payload as [ReturnType<typeof DLActions.getDocumentLockerByTxn>, INetworkDetail, WalletProvider]
      ),
      switchMap((action: [ReturnType<typeof DLActions.getDocumentLockerByTxn>, INetworkDetail, WalletProvider]) => {
        return from(this.DLService.getDocumentLockerFromTxnHash(action[2], action[0].txn)).pipe(
          map((response: IDocumentLockerResponse) => DLActions.getDocumentLockerByTxnSuccess({ payload: response })),
          catchError((error: { message: string; code: number }) =>
            of(DLActions.getDocumentLockerByTxnFailure({ message: error.message }))
          )
        );
      })
    );
  });

  unlockDocumentWithAccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.unlockDocument),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectSearchDocumentLockedData)
      ]),
      filter(
        (payload) => payload[0].hasAccess == true && payload[1] !== null && payload[2] !== null && payload[3] !== null
      ),
      map(
        (
          payload: [
            ReturnType<typeof DLActions.unlockDocument>,
            WalletProvider | null,
            string | null,
            IDocumentLockerResponse | null
          ]
        ) => payload as [ReturnType<typeof DLActions.unlockDocument>, WalletProvider, string, IDocumentLockerResponse]
      ),
      switchMap(
        (action: [ReturnType<typeof DLActions.unlockDocument>, WalletProvider, string, IDocumentLockerResponse]) => {
          return from(this.DLService.getFullDocumentData(action[1], action[3].conctractAddress, action[2])).pipe(
            map((response: IDocumentLockerResponse) => DLActions.getDocumentLockerByTxnSuccess({ payload: response })),
            catchError((error: string) => of(DLActions.getDocumentLockerByTxnFailure({ message: error })))
          );
        }
      )
    );
  });

  unlockDocumentWithoutAccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.unlockDocument),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectSearchDocumentLockedData)
      ]),
      filter(
        (payload) => payload[0].hasAccess == false && payload[1] !== null && payload[2] !== null && payload[3] !== null
      ),
      map(
        (
          payload: [
            ReturnType<typeof DLActions.unlockDocument>,
            WalletProvider | null,
            string | null,
            IDocumentLockerResponse | null
          ]
        ) => payload as [ReturnType<typeof DLActions.unlockDocument>, WalletProvider, string, IDocumentLockerResponse]
      ),
      switchMap(
        (action: [ReturnType<typeof DLActions.unlockDocument>, WalletProvider, string, IDocumentLockerResponse]) => {
          return from(
            this.DLService.unlockFile(action[1], action[2], action[3].price, action[3].conctractAddress)
          ).pipe(
            map((response: IReceiptTransaction) =>
              DLActions.unlockDocumentSuccess({ txn: response.transactionHash, contractAddress: response.to })
            ),
            catchError((error: string) => of(DLActions.unlockDocumentFailure({ message: error })))
          );
        }
      )
    );
  });

  unlockDocumentError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DLActions.unlockDocumentFailure),
        map((action: { message: string }) => {
          let formattedMessage = String(action.message);
          let isErrorKnown = false;

          this.errorMessage.forEach((knownError: KeyAndLabel) => {
            if (formattedMessage.includes(knownError.key)) {
              formattedMessage = knownError.label;
              isErrorKnown = true;
            }
          });

          if (!isErrorKnown) {
            formattedMessage = $localize`:@@documentLockerErrors.unknownError:An error occured while processing your document. Please try again.`;
          }

          return this.snackBar.open(formattedMessage, $localize`:@@commonWords:Close`, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        })
      );
    },
    { dispatch: false }
  );

  unlockDocumentSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DLActions.unlockDocumentSuccess),
        tap(() =>
          this.snackBar.open(
            $localize`:@@DocumentResponse.ContractUnlockingInProcess:Contract unlocking in process`,
            '',
            {
              duration: 5000,
              panelClass: ['success-snackbar']
            }
          )
        )
      );
    },
    { dispatch: false }
  );

  createDocumentLockerWithoutWallet$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DLActions.createDocumentLocker),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] == null && payload[2] == null),
      map(
        (payload: [ReturnType<typeof DLActions.createDocumentLocker>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DLActions.createDocumentLocker>, WalletProvider, string]
      ),
      tap(() => this.web3LoginService.openLoginModal()),
      map(() => {
        return DLActions.createDocumentLockerFailure({
          message: $localize`:@@documentLockerErrors.walletNotConnected:Wallet not connected. Please connect your wallet and try again. If you do not have a wallet, please create one.`
        });
      })
    );
  });

  createDocumentLockerSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DLActions.createDocumentLockerSuccess),
        tap(() => {
          this.snackBar.open(
            $localize`:@@DocumentResponse.LockingDocumentCreatedSuccessfully:Locking document created successfully`,
            '',
            {
              duration: 5000,
              panelClass: ['success-snackbar']
            }
          );
        })
      );
    },
    { dispatch: false }
  );
}
