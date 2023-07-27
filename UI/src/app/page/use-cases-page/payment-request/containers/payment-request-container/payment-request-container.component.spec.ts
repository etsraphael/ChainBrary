import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestContainerComponent } from './payment-request-container.component';
import { StoreModule } from '@ngrx/store';

describe('PaymentRequestContainerComponent', () => {
  let component: PaymentRequestContainerComponent;
  let fixture: ComponentFixture<PaymentRequestContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [PaymentRequestContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
