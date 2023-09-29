import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeaderLoginComponent } from './card-header-login.component';

describe('CardHeaderLoginComponent', () => {
  let component: CardHeaderLoginComponent;
  let fixture: ComponentFixture<CardHeaderLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardHeaderLoginComponent]
    });
    fixture = TestBed.createComponent(CardHeaderLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
