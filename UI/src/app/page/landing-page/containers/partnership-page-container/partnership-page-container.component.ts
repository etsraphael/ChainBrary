import { Component, HostListener } from '@angular/core';
import { ILandingPageCard } from '../../components/landing-page-card/landing-page-card.component';

@Component({
  selector: 'app-partnership-page-container',
  templateUrl: './partnership-page-container.component.html',
  styleUrls: ['./partnership-page-container.component.scss']
})
export class PartnershipPageContainerComponent {
  landingPageCards: ILandingPageCard[] = [
    {
      icon: 'bi-app',
      title: 'Services',
      description: '1. Receive payments in tokens. 2. Lock your confidential files. 3. Lock a document'
    },
    {
      icon: 'bi-arrows-move',
      title: 'Extend Community',
      description: 'Use and exchange your tokens on the platform and keep growing.'
    },
    {
      icon: 'bi-gear',
      title: 'Maintenance',
      description: 'We constantly maintain for the expansion and improvement of our features.'
    },
    {
      icon: 'bi-safe2',
      title: 'Community Vault',
      description: 'A vault that earns you benefits. Be the first one to be a part of it.'
    },
    {
      icon: 'bi-book',
      title: 'Open Source',
      description: 'Our application is an open source, transparent to all.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Security',
      description: 'We keep performing Audits to have that high-level secure transactions always.'
    }
  ];

  sectionsAndDescriptions: ISectionAndDescription[] = [
    {
      id: 'section1',
      title: 'Connect with us on Discord',
      desc: 'Discord is the chat community where we talk about our product all the time.'
    },
    {
      id: 'section2',
      title: 'Project Introduction',
      desc: 'Explain about your project and clarify all doubts and have discuss.'
    },
    {
      id: 'section3',
      title: 'Integration',
      desc: 'Get the project onboard and processed by us in no time.'
    }
  ];

  currentSection: string;
  progressHeights: { [key: string]: string } = {};

  constructor() {
    // Initialize progressHeights with 0% for each section
    for (const section of this.sectionsAndDescriptions) {
      this.progressHeights[section.id] = '0%';
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // Loop through each section to determine which is in view
    for (const section of this.sectionsAndDescriptions) {
      const element = document.getElementById(section.id);
      const position = element?.getBoundingClientRect();
      const offset = window.innerHeight / 2;

      if (position && position.top <= offset && position.bottom >= offset) {
        this.currentSection = section.id;
        this.progressHeights[section.id] = '100%';
      }
      if (position && position.bottom < offset) {
        this.progressHeights[section.id] = '100%';
      } else {
        this.progressHeights[section.id] = '0%';
      }
    }
  }
}

interface ISectionAndDescription {
  id: string;
  title: string;
  desc: string;
}
