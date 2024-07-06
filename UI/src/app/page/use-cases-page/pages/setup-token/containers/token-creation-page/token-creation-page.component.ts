import { Component } from '@angular/core';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { FormatService } from './../../../../../../shared/services/format/format.service';

@Component({
  selector: 'app-token-creation-page',
  templateUrl: './token-creation-page.component.html',
  styleUrl: './token-creation-page.component.scss'
})
export class TokenCreationPageComponent {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@createTokenTitle:Create Token`,
    goBackLink: '/use-cases/setup-token/services',
    description: $localize`:@@printCreateTokenHeaderDescription:Simple, Fast, Convenient to create tokens. Get 100% ownership of generated tokens with Custom token name, symbol and initial supply. Automatic verified and published contract source code.`
  };

  networkAvailable: INetworkDetail[] = this.web3LoginService
    .getNetworkDetailList()
    .filter((network: INetworkDetail) =>
      [NetworkChainId.ETHEREUM, NetworkChainId.BNB, NetworkChainId.AVALANCHE, NetworkChainId.POLYGON].includes(
        network.chainId
      )
    );

  networkSelected: NetworkChainId | null = null;

  constructor(
    private web3LoginService: Web3LoginService,
    public formatService: FormatService
  ) {}

  selectNetwork(network: NetworkChainId): void {
    this.networkSelected = network;
  }
}
