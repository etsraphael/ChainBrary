import { Component, OnInit } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { IDocumentLockerCreation } from './../../../../../../shared/interfaces';
import { selectCurrentNetwork } from './../../../../../../store/auth-store/state/selectors';
import {
  createDocumentLocker,
  resetDocumentLocker
} from './../../../../../../store/document-locker-store/state/actions';
import { selectDocumentLockerCreationError } from './../../../../../../store/document-locker-store/state/selectors';

@Component({
  selector: 'app-document-locker-maker',
  templateUrl: './document-locker-maker.component.html',
  styleUrls: ['./document-locker-maker.component.scss']
})
export class DocumentLockerMakerComponent implements OnInit {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@documentLockerMakerTitle:Create a locked document`,
    goBackLink: '/use-cases/document-locker/services',
    description: null
  };

  constructor(private readonly store: Store) {}

  currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  creationError$: Observable<string | null> = this.store.select(selectDocumentLockerCreationError);

  ngOnInit(): void {
    this.store.dispatch(resetDocumentLocker());
  }

  sendDocumentLockerAction(payload: IDocumentLockerCreation): void {
    return this.store.dispatch(createDocumentLocker({ payload }));
  }
}
