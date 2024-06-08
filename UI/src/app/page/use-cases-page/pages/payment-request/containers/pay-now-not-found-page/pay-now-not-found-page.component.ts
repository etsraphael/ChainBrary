import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pay-now-not-found-page',
  templateUrl: './pay-now-not-found-page.component.html',
  styleUrls: ['./pay-now-not-found-page.component.scss']
})
export class PayNowNotFoundPageComponent {
  constructor(public location: Location) {}
}
