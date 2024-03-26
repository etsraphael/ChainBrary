import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page-header',
  templateUrl: './landing-page-header.component.html',
  styleUrls: ['./landing-page-header.component.scss']
})
export class LandingPageHeaderPageComponent {

  iconList: IconsBranding[] = [
    {url: 'avalanche-brand.svg'},
    {url: 'binance-brand.svg'},
    {url: 'ethereum-brand.svg'},
    {url: 'polkadot-brand.svg'},
    {url: 'polygon-brand.svg'}
  ]
}

interface IconsBranding {
  url: string
}
