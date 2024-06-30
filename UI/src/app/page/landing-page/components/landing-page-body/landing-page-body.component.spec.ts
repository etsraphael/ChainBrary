import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IServiceCard } from './../../../../shared/components/service-card/service-card.component';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { LandingPageBodyComponent } from './landing-page-body.component';

describe('LandingPageBodyComponent', () => {
  let component: LandingPageBodyComponent = new LandingPageBodyComponent();
  let fixture: ComponentFixture<LandingPageBodyComponent>;
  const cards: IServiceCard[] = component.cards;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageBodyComponent],
      imports: [SharedTestModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have cards with description property', () => {
    cards.forEach((card: IServiceCard) => {
      expect(card.description).toBeDefined();
      expect(typeof card.description).toEqual('string');
      expect(card.description.length).toBeGreaterThan(0);
    });
  });

  it('should have cards with image property', () => {
    const icons = [
      'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/payment-service.svg',
      'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/bid-service.svg',
      'https://chainbraryfrontendassets.blob.core.windows.net/illustrations/document-service.svg'
    ];

    cards.forEach((card: IServiceCard, index: number) => {
      expect(card.img).toBeDefined();
      expect(typeof card.img).toEqual('string');
      expect(card.img.length).toBeGreaterThan(0);
      expect(card.img).toEqual(icons[index]);
    });
  });

  it('should have an array of cards', () => {
    expect(cards).toBeDefined();
    expect(Array.isArray(cards)).toBeTruthy();
  });

  it('should have cards with description property', () => {
    cards.forEach((card: IServiceCard) => {
      expect(card.description).toBeDefined();
      expect(typeof card.description).toEqual('string');
      expect(card.description.length).toBeGreaterThan(0);
    });
  });
});
