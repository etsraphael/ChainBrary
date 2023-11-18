import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidResultComponent } from './bid-result.component';

describe('BidResultComponent', () => {
  let component: BidResultComponent;
  let fixture: ComponentFixture<BidResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BidResultComponent]
    });
    fixture = TestBed.createComponent(BidResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
