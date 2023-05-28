import { LandingPageBodyComponent, LandingPageCard } from './landing-page-body.component';
import { describe, expect, it, beforeEach } from 'vitest';

describe('LandingPageBodyComponent', () => {
  let component: LandingPageBodyComponent;
  let cards: LandingPageCard[];

  beforeEach(() => {
    component = new LandingPageBodyComponent();
    cards = component.cards;
  });

  it('should create LandingPageBodyComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an array of cards', () => {
    expect(cards).toBeDefined();
    expect(Array.isArray(cards)).toBeTruthy();
  });

  it('should have cards with title property', () => {
    const titles = ['Open Source', 'Accessible', 'Transparent'];

    cards.forEach((card: LandingPageCard, index: number) => {
      expect(card.title).toBeDefined();
      expect(card.title).toBeTypeOf('string');
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.title).toEqual(titles[index]);
    });
  });

  it('should have cards with description property', () => {
    cards.forEach((card: LandingPageCard) => {
      expect(card.description).toBeDefined();
      expect(card.description).toBeTypeOf('string');
      expect(card.description.length).toBeGreaterThan(0);
    });
  });

  it('should have cards with icon property', () => {
    const icons = ['bi-file-earmark-code', 'bi-universal-access', 'bi-eye'];

    cards.forEach((card: LandingPageCard, index: number) => {
      expect(card.icon).toBeDefined();
      expect(card.icon).toBeTypeOf('string');
      expect(card.icon.length).toBeGreaterThan(0);
      expect(card.icon).toEqual(icons[index]);
    });
  });
});
