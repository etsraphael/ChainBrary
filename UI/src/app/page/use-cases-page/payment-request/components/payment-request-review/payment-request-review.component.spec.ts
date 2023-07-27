import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { PaymentRequestReviewComponent } from './payment-request-review.component';

describe('PaymentRequestReviewComponent', () => {
  let component: PaymentRequestReviewComponent;
  let fixture: ComponentFixture<PaymentRequestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule],
      declarations: [PaymentRequestReviewComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
