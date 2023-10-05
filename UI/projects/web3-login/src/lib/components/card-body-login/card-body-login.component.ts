import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WalletProvider, Web3Provider, providerData } from '../../interfaces';

@Component({
  selector: 'lib-card-body-login',
  templateUrl: './card-body-login.component.html',
  styleUrls: ['./card-body-login.component.scss']
})
export class CardBodyLoginComponent {
  @Input() isLoading = false;
  @Output() openWalletProviderEvent = new EventEmitter<WalletProvider>();

  providers = providerData;

  getGradientStyle(provider: Web3Provider): string {
    return `linear-gradient(${provider.backgroundColorGradient.orientation.start[0]}deg, ${provider.backgroundColorGradient.start}, ${provider.backgroundColorGradient.end})`;
  }
}
