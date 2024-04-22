import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pay-now-page',
  templateUrl: './pay-now-page.component.html',
  styleUrls: ['./pay-now-page.component.scss']
})
export class PayNowPageComponent {
  constructor(public location: Location) {}
}
