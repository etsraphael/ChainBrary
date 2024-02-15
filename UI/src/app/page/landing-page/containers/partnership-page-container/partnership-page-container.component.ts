import { Component } from '@angular/core';
import { ILandingPageCard } from '../../components/landing-page-card/landing-page-card.component';

@Component({
  selector: 'app-partnership-page-container',
  templateUrl: './partnership-page-container.component.html',
  styleUrls: ['./partnership-page-container.component.scss']
})
export class PartnershipPageContainerComponent {
  landingPageCards: ILandingPageCard[] = [
    {
      icon: 'icon1',
      title: 'Title 1',
      description: 'Description 1'
    },
    {
      icon: 'icon2',
      title: 'Title 2',
      description: 'Description 2'
    },
    {
      icon: 'icon3',
      title: 'Title 3',
      description: 'Description 3'
    },
    {
      icon: 'icon4',
      title: 'Title 4',
      description: 'Description 4'
    },
    {
      icon: 'icon5',
      title: 'Title 5',
      description: 'Description 5'
    },
    {
      icon: 'icon6',
      title: 'Title 6',
      description: 'Description 6'
    }
  ];
}
