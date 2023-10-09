import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { WalletProvider } from '../../interfaces';
import { PrivateGlobalValuesService } from '../../services/global-values/private-global-values.service';
import { MetamaskProviderService } from '../../services/providers/metamask-provider/metamask-provider.service';

@Component({
  selector: 'lib-web3-login',
  templateUrl: './web3-login.component.html',
  styleUrls: ['./web3-login.component.scss']
})
export class Web3LoginComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<Web3LoginComponent>,
    private metamaskProviderService: MetamaskProviderService,
    private privateGlobalValuesService: PrivateGlobalValuesService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.privateGlobalValuesService.isLoading$;
  }

  ngOnDestroy(): void {
    this.privateGlobalValuesService.isLoading = false;
  }

  openWalletProvider(providerKey: WalletProvider): void {
    switch (providerKey) {
      case WalletProvider.METAMASK:
        return this.metamaskProviderService.logInWithWallet();
    }
  }
}
