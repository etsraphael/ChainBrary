import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, filter, map, takeUntil, withLatestFrom } from 'rxjs';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import {
  IDocumentLockerCreation,
  IDocumentLockerResponse,
  IDocumentUnlockedResponse,
  StoreState
} from './../../../../../../shared/interfaces';
import { networkChangeSuccess, setAuthPublicAddress } from './../../../../../../store/auth-store/state/actions';
import { selectCurrentNetwork, selectIsConnected } from './../../../../../../store/auth-store/state/selectors';
import { getDocumentLockerByTxn, unlockDocument } from './../../../../../../store/document-locker-store/state/actions';
import {
  selectDocumentLockerCreation,
  selectSearchDocumentLocked
} from './../../../../../../store/document-locker-store/state/selectors';

@Component({
  selector: 'app-document-locker-found',
  templateUrl: './document-locker-found.component.html',
  styleUrls: ['./document-locker-found.component.scss']
})
export class DocumentLockerFoundComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  headerPayload: IUseCasesHeader = {
    title: 'Document Locked',
    goBackLink: '/use-cases/document-locker/services',
    description: null
  };

  constructor(
    public web3LoginService: Web3LoginService,
    private readonly store: Store,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {}

  private readonly documentLockedStore$: Observable<
    StoreState<IDocumentLockerResponse | IDocumentUnlockedResponse | null>
  > = this.store.select(selectSearchDocumentLocked);
  private readonly documentLockerCreationStore$: Observable<StoreState<IDocumentLockerCreation | null>> =
    this.store.select(selectDocumentLockerCreation);
  readonly userIsConnected$: Observable<boolean> = this.store.select(selectIsConnected);
  readonly currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);

  get documentLocked$(): Observable<IDocumentLockerResponse | IDocumentUnlockedResponse | null> {
    return this.documentLockedStore$.pipe(map((s) => s.data));
  }

  get documentLockerCreationIsLoading$(): Observable<boolean> {
    return this.documentLockerCreationStore$.pipe(map((s) => s.loading));
  }

  get documentLockedIsLoading$(): Observable<boolean> {
    return this.documentLockedStore$.pipe(map((s) => s.loading));
  }

  get documentLockedIsError$(): Observable<string | null> {
    return this.documentLockedStore$.pipe(map((s) => s.error));
  }

  ngOnInit(): void {
    this.callActions();
    this.listenNetworkChanged();
  }

  listenNetworkChanged(): void {
    this.actions$.pipe(ofType(networkChangeSuccess), takeUntil(this.destroyed$)).subscribe(() => this.getDocument());
  }

  callActions(): void {
    // load bid when user is connected
    this.actions$
      .pipe(
        ofType(setAuthPublicAddress),
        filter(
          (event: { publicAddress: string }) =>
            this.route.snapshot.paramMap.get('id') !== null && event.publicAddress !== null
        ),
        withLatestFrom(this.documentLockedIsLoading$),
        filter(([, isLoading]) => !isLoading),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => this.getDocument());
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  unlockDocument(event: { hasAccess: boolean }): void {
    return this.store.dispatch(unlockDocument({ hasAccess: event.hasAccess }));
  }

  private getDocument(): void {
    return this.store.dispatch(getDocumentLockerByTxn({ txn: this.route.snapshot.paramMap.get('id') as string }));
  }
}
