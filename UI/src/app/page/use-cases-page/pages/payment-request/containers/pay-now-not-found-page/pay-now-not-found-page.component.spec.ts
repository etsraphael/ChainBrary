import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayNowNotFoundPageComponent } from './pay-now-not-found-page.component';

describe('PayNowNotFoundPageComponent', () => {
  let component: PayNowNotFoundPageComponent;
  let fixture: ComponentFixture<PayNowNotFoundPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayNowNotFoundPageComponent]
    });
    fixture = TestBed.createComponent(PayNowNotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
