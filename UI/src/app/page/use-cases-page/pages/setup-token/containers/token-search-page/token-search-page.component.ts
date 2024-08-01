import { Component, isDevMode, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { ActionStoreProcessing } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { resetTokenManagement, searchToken } from './../../../../../../store/tokens-management-store/state/actions';
import { selectSearchToken } from './../../../../../../store/tokens-management-store/state/selectors';

@Component({
  selector: 'app-token-search-page',
  templateUrl: './token-search-page.component.html',
  styleUrl: './token-search-page.component.scss'
})
export class TokenSearchPageComponent implements OnInit {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@useCasesSearchTokenTitle:Search token`,
    goBackLink: '/use-cases/setup-token/services',
    description: null
  };

  networkAvailable: INetworkDetail[] = this.web3LoginService
    .getNetworkDetailList()
    .filter((network: INetworkDetail) =>
      [
        isDevMode() ? NetworkChainId.LOCALHOST : NetworkChainId.ETHEREUM,
        NetworkChainId.BNB,
        NetworkChainId.AVALANCHE,
        NetworkChainId.POLYGON
      ].includes(network.chainId)
    );

  mainForm: FormGroup<SearchTokenForm> = new FormGroup<SearchTokenForm>({
    contractAddress: new FormControl<string | null>(null, [
      Validators.required,
      this.formatService.ethAddressValidator()
    ]),
    networkChainId: new FormControl<NetworkChainId | null>(null, [Validators.required])
  });

  readonly searchToken$: Observable<ActionStoreProcessing> = this.store.select(selectSearchToken);

  constructor(
    public web3LoginService: Web3LoginService,
    private formatService: FormatService,
    private store: Store
  ) {}

  get searchTokenProcessing$(): Observable<boolean> {
    return this.searchToken$.pipe(map((s: ActionStoreProcessing) => s.isLoading));
  }

  get searchTokenError$(): Observable<string | null> {
    return this.searchToken$.pipe(map((s: ActionStoreProcessing) => s.errorMessage));
  }

  ngOnInit(): void {
    this.store.dispatch(resetTokenManagement());
  }

  searchToken(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.invalid) return;
    else
      this.store.dispatch(
        searchToken({
          contractAddress: this.mainForm.get('contractAddress')?.value as string,
          chainId: this.mainForm.get('networkChainId')?.value as NetworkChainId
        })
      );
  }
}

export interface SearchTokenForm {
  contractAddress: FormControl<string | null>;
  networkChainId: FormControl<NetworkChainId | null>;
}
