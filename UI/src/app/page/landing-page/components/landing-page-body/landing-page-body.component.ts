import { Component } from '@angular/core';
import { LandingPageCard, cards } from './core';

@Component({
  selector: 'app-landing-page-body',
  templateUrl: './landing-page-body.component.html',
  styleUrls: ['./landing-page-body.component.scss']
})
export class LandingPageBodyComponent {
  cards: LandingPageCard[] = cards;
}

