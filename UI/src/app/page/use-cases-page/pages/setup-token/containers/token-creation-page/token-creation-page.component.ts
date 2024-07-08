import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { CommonButtonText } from './../../../../../../shared/enum';
import { FormatService } from './../../../../../../shared/services/format/format.service';

@Component({
  selector: 'app-token-creation-page',
  templateUrl: './token-creation-page.component.html',
  styleUrl: './token-creation-page.component.scss'
})
export class TokenCreationPageComponent {
  commonButtonText = CommonButtonText;
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@createTokenTitle:Create Token`,
    goBackLink: '/use-cases/setup-token/services',
    description: $localize`:@@printCreateTokenHeaderDescription:Simple, Fast, Convenient to create tokens. Get 100% ownership of generated tokens with Custom token name, symbol and initial supply. Automatic verified and published contract source code.`
  };
  mainForm: FormGroup<ITokenCreationForm> = new FormGroup<ITokenCreationForm>({
    name: new FormControl<string | null>(null, [Validators.required]),
    symbol: new FormControl<string | null>(null, [Validators.required]),
    maxSupply: new FormControl<number | null>(null, [Validators.required]),
    decimals: new FormControl<number | null>(null, [Validators.required]),
    network: new FormControl<NetworkChainId | null>(null, [Validators.required]),
    options: new FormGroup<ICheckboxOptionsForm>({
      canBurn: new FormControl<boolean>(false),
      canMint: new FormControl<boolean>(false),
      canPause: new FormControl<boolean>(false)
    })
  });

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

  submit(): void {
    this.mainForm.markAllAsTouched();
    console.log('called submit');
    console.log('mainForm', this.mainForm.value);
  }
}

export interface ITokenCreationForm {
  name: FormControl<string | null>;
  symbol: FormControl<string | null>;
  maxSupply: FormControl<number | null>;
  decimals: FormControl<number | null>;
  network: FormControl<NetworkChainId | null>;
  options: FormGroup<ICheckboxOptionsForm>;
}

export interface ICheckboxOptionsForm {
  canBurn: FormControl<boolean | null>;
  canMint: FormControl<boolean | null>;
  canPause: FormControl<boolean | null>;
}
