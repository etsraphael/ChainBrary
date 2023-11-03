import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidCreationComponent } from './bid-creation.component';

describe('BidCreationComponent', () => {
  let component: BidCreationComponent;
  let fixture: ComponentFixture<BidCreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BidCreationComponent]
    });
    fixture = TestBed.createComponent(BidCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
