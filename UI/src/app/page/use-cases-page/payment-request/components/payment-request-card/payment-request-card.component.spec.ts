import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MaterialModule } from './../../../../../module/material.module';
import { PaymentRequestCardComponent } from './payment-request-card.component';

describe('PaymentRequestCardComponent', () => {
  let component: PaymentRequestCardComponent;
  let fixture: ComponentFixture<PaymentRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [PaymentRequestCardComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
