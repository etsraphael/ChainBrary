import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidSearchComponent } from './bid-search.component';

describe('BidSearchComponent', () => {
  let component: BidSearchComponent;
  let fixture: ComponentFixture<BidSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BidSearchComponent]
    });
    fixture = TestBed.createComponent(BidSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
