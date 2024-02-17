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
