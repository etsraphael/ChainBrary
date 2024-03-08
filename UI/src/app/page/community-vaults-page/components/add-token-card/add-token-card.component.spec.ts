import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTokenCardComponent } from './add-token-card.component';

describe('AddTokenCardComponent', () => {
  let component: AddTokenCardComponent;
  let fixture: ComponentFixture<AddTokenCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTokenCardComponent]
    });
    fixture = TestBed.createComponent(AddTokenCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
