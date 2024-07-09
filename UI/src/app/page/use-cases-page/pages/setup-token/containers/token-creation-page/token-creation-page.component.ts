import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { CommonButtonText } from './../../../../../../shared/enum';
import { ITokenCreationPayload } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { createToken } from './../../../../../../store/tokens-management-store/state/actions';

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
    network: new FormControl<NetworkChainId | null>(null, [Validators.required]),
    maxSupply: new FormControl<number | null>(null, [Validators.required]),
    decimals: new FormControl<number | null>(18, [Validators.required, Validators.min(1), Validators.max(18)]),
    options: new FormGroup<ICheckboxOptionsForm>({
      canBurn: new FormControl<boolean>(false),
      canMint: new FormControl<boolean>(false),
      canPause: new FormControl<boolean>(false)
    })
  });

  optionsList: ITokenOptions[] = [
    {
      formControlName: 'canBurn',
      title: $localize`:@@canBurn:Can Burn`,
      description: $localize`:@@canBurnDescription:Allow the contract owner to burn tokens.`
    },
    {
      formControlName: 'canMint',
      title: $localize`:@@canMint:Can Mint`,
      description: $localize`:@@canMintDescription:Allow the contract owner to mint tokens.`
    },
    {
      formControlName: 'canPause',
      title: $localize`:@@canPause:Can Pause`,
      description: $localize`:@@canPauseDescription:Allow the contract owner to pause the contract.`
    }
  ];

  networkAvailable: INetworkDetail[] = this.web3LoginService
    .getNetworkDetailList()
    .filter((network: INetworkDetail) =>
      [NetworkChainId.ETHEREUM, NetworkChainId.BNB, NetworkChainId.AVALANCHE, NetworkChainId.POLYGON].includes(
        network.chainId
      )
    );

  constructor(
    private web3LoginService: Web3LoginService,
    public formatService: FormatService,
    private store: Store
  ) {}

  selectNetwork(network: NetworkChainId): void {
    return this.mainForm.get('network')?.setValue(network);
  }

  submit(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.invalid) return;
    else this.store.dispatch(createToken({ payload: this.formToTokenCreationPayload() }));
  }

  getTokenOptionControlByName(name: string): FormControl<boolean> {
    return this.mainForm.get('options')?.get(name) as FormControl<boolean>;
  }

  increaseDecimals(): void {
    return this.mainForm.get('decimals')?.setValue((this.mainForm.get('decimals')?.value as number) + 1);
  }

  decreaseDecimals(): void {
    return this.mainForm.get('decimals')?.setValue((this.mainForm.get('decimals')?.value as number) - 1);
  }

  private formToTokenCreationPayload(): ITokenCreationPayload {
    return {
      name: this.mainForm.get('name')?.value as string,
      symbol: this.mainForm.get('symbol')?.value as string,
      network: this.mainForm.get('network')?.value as NetworkChainId,
      maxSupply: this.mainForm.get('maxSupply')?.value as number,
      decimals: this.mainForm.get('decimals')?.value as number,
      canBurn: this.mainForm.get('options')?.get('canBurn')?.value as boolean,
      canMint: this.mainForm.get('options')?.get('canMint')?.value as boolean,
      canPause: this.mainForm.get('options')?.get('canPause')?.value as boolean
    };
  }
}

export interface ITokenCreationForm {
  name: FormControl<string | null>;
  symbol: FormControl<string | null>;
  network: FormControl<NetworkChainId | null>;
  maxSupply: FormControl<number | null>;
  decimals: FormControl<number | null>;
  options: FormGroup<ICheckboxOptionsForm>;
}

export interface ICheckboxOptionsForm {
  canBurn: FormControl<boolean | null>;
  canMint: FormControl<boolean | null>;
  canPause: FormControl<boolean | null>;
}

interface ITokenOptions {
  formControlName: string;
  title: string;
  description: string;
}
