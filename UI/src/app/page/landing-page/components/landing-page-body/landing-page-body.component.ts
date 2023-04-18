import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page-body',
  templateUrl: './landing-page-body.component.html',
  styleUrls: ['./landing-page-body.component.scss']
})
export class LandingPageBodyComponent {
  cards: LandingPageCard[] = [
    {
      title: 'Open Source',
      description:
        'Our platform uses blockchain technology to secure your assets and we employ regular audits to our system to protect the confidentiality and integrity of your information.',
      icon: 'bi-inboxes-fill-code'
    },
    {
      title: 'Accessible',
      description:
        'Our platform is designed to be easy to use and accessible to all. With user-friendly interfaces and detailed documentation, anyone can take advantage of the power of our blockchain technology.',
      icon: 'bi-universal-access'
    },
    {
      title: 'Transparent',
      description:
        'Our platform is open source, allowing for a collaborative and transparent community of developers and users. This helps to ensure that our platform remains reliable and up-to-date.',
      icon: 'bi-eye'
    }
  ];
}

interface LandingPageCard {
  title: string;
  description: string;
  icon: string;
}
