import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import { PaymentPageComponent } from './payment-page.component';

describe('PaymentPageComponent', () => {
  let component: PaymentPageComponent;
  let fixture: ComponentFixture<PaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SharedTestModule],
      declarations: [PaymentPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
