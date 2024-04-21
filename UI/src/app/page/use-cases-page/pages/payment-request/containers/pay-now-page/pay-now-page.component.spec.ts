import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayNowPageComponent } from './pay-now-page.component';

describe('PayNowPageComponent', () => {
  let component: PayNowPageComponent;
  let fixture: ComponentFixture<PayNowPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayNowPageComponent]
    });
    fixture = TestBed.createComponent(PayNowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
