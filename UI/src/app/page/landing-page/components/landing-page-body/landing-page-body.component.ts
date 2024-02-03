import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page-body',
  templateUrl: './landing-page-body.component.html',
  styleUrls: ['./landing-page-body.component.scss']
})
export class LandingPageBodyComponent {
  cards: LandingPageCard[] = [
    {
      title: $localize`:@@landingPage.openSource:Open Source`,
      description: $localize`:@@landingPage.openSourceDesc:Our platform uses blockchain technology to secure your assets and we employ regular audits to our system to protect the confidentiality and integrity of your information.`,
      icon: 'bi-file-earmark-code'
    },
    {
      title: $localize`:@@landingPage.accessible:Accessible`,
      description: $localize`:@@landingPage.ourPlateformIsDesignedTo:Our platform is designed to be easy to use and accessible to all. With user-friendly interfaces and detailed documentation, anyone can take advantage of the power of our blockchain technology.`,
      icon: 'bi-universal-access'
    },
    {
      title: $localize`:@@landingPage.transparent:Transparent`,
      description: $localize`:@@landingPage.ourPlateformIsOpenSource:Our platform is open source, allowing for a collaborative and transparent community of developers and users. This helps to ensure that our platform remains reliable and up-to-date.`,
      icon: 'bi-eye'
    }
  ];
}

export interface LandingPageCard {
  title: string;
  description: string;
  icon: string;
}
