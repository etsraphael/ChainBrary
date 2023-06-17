import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IModalState, Web3Provider, providerData } from '../../interfaces';

@Component({
  selector: 'lib-body[isLoading]',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  @Input() isLoading = false;
  @Output() stateEvent = new EventEmitter<IModalState>();
  @Output() openWalletProviderEvent = new EventEmitter<string>();

  providers = providerData;

  getGradientStyle(provider: Web3Provider): string {
    return `linear-gradient(${provider.backgroundColorGradient.orientation.start[0]}deg, ${provider.backgroundColorGradient.start}, ${provider.backgroundColorGradient.end})`;
  }
}
