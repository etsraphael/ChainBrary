import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestProfileSettingsComponent } from './payment-request-profile-settings.component';

describe('PaymentRequestProfileSettingsComponent', () => {
  let component: PaymentRequestProfileSettingsComponent;
  let fixture: ComponentFixture<PaymentRequestProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentRequestProfileSettingsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
