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
      description: 'Explore our multifaceted services: process token payments, secure sensitive files, and utilize our document locker for enhanced privacy.'
    },
    {
      icon: 'bi-arrows-move',
      title: 'Extend Community',
      description: 'Grow with us by engaging in our token-based ecosystem, fostering continuous exchange and community expansion.'
    },
    {
      icon: 'bi-gear',
      title: 'Maintenance',
      description: 'Benefit from our commitment to regular updates and enhancements, ensuring state-of-the-art features for our users.'
    },
    {
      icon: 'bi-safe2',
      title: 'Community Vault',
      description: 'Join our Community Vault for mutual benefits. Be among the pioneers in this innovative financial tool.'
    },
    {
      icon: 'bi-book',
      title: 'Open Source',
      description: 'Our platform is transparent and open source, inviting collaboration and trust from our users.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Security',
      description: 'Security is our priority. Rely on our advanced measures to safeguard your blockchain interactions.'
    }
  ];

  sectionsAndDescriptions: ISectionAndDescription[] = [
    {
      id: 'section1',
      title: 'Join Our Discord Hub',
      desc: "Discover Chainbrary's blockchain world on Discord. Connect, learn, and share insights in our community."
    },
    {
      id: 'section2',
      title: 'Explore Chainbrary',
      desc: 'Learn how Chainbrary demystifies blockchain, making it accessible and relevant for everyday use.'
    },
    {
      id: 'section3',
      title: 'Easy Integration',
      desc: "Quickly integrate Chainbrary's user-friendly blockchain solutions into your projects."
    }
  ];

  projectsList: IProjectIcons[] = [
    { id: 'bnb', icon: 'bnb-icon.svg' },
    { id: 'atom', icon: 'atom-icon.svg' },
    { id: 'dot', icon: 'dot-icon.svg' },
    { id: 'eth', icon: 'eth-icon.svg' },
    { id: 'usdc', icon: 'usdc-icon.svg' }
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

  getIconStyle(index: number): { [key: string]: string } {
    const totalIcons = this.projectsList.length;
    const arcAngle = 250; // degrees, adjust if you want a wider or narrower arc
    const angleStep = arcAngle / (totalIcons - 1);
    const angle = angleStep * index - arcAngle / 2;
    const radians = (angle * Math.PI) / 180;

    const translateY = -Math.cos(radians) * 100; // radius of the arc, adjust as needed
    const translateX = Math.sin(radians) * 100; // radius of the arc, adjust as needed

    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px)`
    };
  }
}

interface ISectionAndDescription {
  id: string;
  title: string;
  desc: string;
}

interface IProjectIcons {
  id: string;
  icon: string;
}
