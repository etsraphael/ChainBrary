import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageBodyComponent, LandingPageCard } from './landing-page-body.component';

describe('LandingPageBodyComponent', () => {
  let component: LandingPageBodyComponent = new LandingPageBodyComponent();
  let fixture: ComponentFixture<LandingPageBodyComponent>;
  const cards: LandingPageCard[] = component.cards;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageBodyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have cards with title property', () => {
    const titles = ['Open Source', 'Accessible', 'Transparent'];

    cards.forEach((card: LandingPageCard, index: number) => {
      expect(card.title).toBeDefined();
      expect(typeof card.title).toEqual('string');
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.title).toEqual(titles[index]);
    });
  });

  it('should have cards with description property', () => {
    cards.forEach((card: LandingPageCard) => {
      expect(card.description).toBeDefined();
      expect(typeof card.description).toEqual('string');
      expect(card.description.length).toBeGreaterThan(0);
    });
  });

  it('should have cards with icon property', () => {
    const icons = ['bi-file-earmark-code', 'bi-universal-access', 'bi-eye'];

    cards.forEach((card: LandingPageCard, index: number) => {
      expect(card.icon).toBeDefined();
      expect(typeof card.icon).toEqual('string');
      expect(card.icon.length).toBeGreaterThan(0);
      expect(card.icon).toEqual(icons[index]);
    });
  });

  it('should have an array of cards', () => {
    expect(cards).toBeDefined();
    expect(Array.isArray(cards)).toBeTruthy();
  });

  it('should have cards with title property', () => {
    const titles = ['Open Source', 'Accessible', 'Transparent'];

    cards.forEach((card: LandingPageCard, index: number) => {
      expect(card.title).toBeDefined();
      expect(typeof card.title).toEqual('string');
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.title).toEqual(titles[index]);
    });
  });

  it('should have cards with description property', () => {
    cards.forEach((card: LandingPageCard) => {
      expect(card.description).toBeDefined();
      expect(typeof card.description).toEqual('string');
      expect(card.description.length).toBeGreaterThan(0);
    });
  });

  it('should have cards with icon property', () => {
    const icons = ['bi-file-earmark-code', 'bi-universal-access', 'bi-eye'];

    cards.forEach((card: LandingPageCard, index: number) => {
      expect(card.icon).toBeDefined();
      expect(typeof card.icon).toEqual('string');
      expect(card.icon.length).toBeGreaterThan(0);
      expect(card.icon).toEqual(icons[index]);
    });
  });
});
