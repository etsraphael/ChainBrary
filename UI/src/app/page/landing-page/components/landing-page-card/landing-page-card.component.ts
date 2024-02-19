import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-landing-page-card[card]',
  templateUrl: './landing-page-card.component.html',
  styleUrls: ['./landing-page-card.component.scss']
})
export class LandingPageCardComponent {
  @Input() card: ILandingPageCard;
}

export interface ILandingPageCard {
  icon: string;
  title: string;
  description: string;
}
