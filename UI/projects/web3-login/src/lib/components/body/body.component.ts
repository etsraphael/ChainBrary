import { Component } from '@angular/core';
@Component({
  selector: 'lib-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  providers: Web3Provider[] = [
    {
      key: 'metamask',
      name: 'Metamask',
      iconUrl: './../assets/metamask.svg',
      backgroundColorGradient: {
        start: '#B16000',
        end: '#DF7900',
        orientation: {
          start: [0, 0],
          end: [0, 1]
        }
      }
    },
    {
      key: 'ledger',
      name: 'Ledger',
      iconUrl: './../assets/ledger.svg',
      backgroundColorGradient: {
        start: '#1B1713',
        end: '#303030',
        orientation: {
          start: [0, 0],
          end: [0, 1]
        }
      }
    }
  ]

  getGradientStyle(provider: Web3Provider): string {
    return `linear-gradient(${provider.backgroundColorGradient.orientation.start[0]}deg, ${provider.backgroundColorGradient.start}, ${provider.backgroundColorGradient.end})`;
  }
}

interface Web3Provider {
  key: string;
  name: string;
  iconUrl: string;
  backgroundColorGradient: {
    start: string;
    end: string;
    orientation: {
      start: [number, number]
      end: [number, number]
    }
  }
}
