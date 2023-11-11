import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidPageComponent } from './bid-page.component';

describe('BidPageComponent', () => {
  let component: BidPageComponent;
  let fixture: ComponentFixture<BidPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BidPageComponent]
    });
    fixture = TestBed.createComponent(BidPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
