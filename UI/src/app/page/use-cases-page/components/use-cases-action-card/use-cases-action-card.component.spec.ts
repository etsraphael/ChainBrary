import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCasesActionCardComponent } from './use-cases-action-card.component';

describe('UseCasesActionCardComponent', () => {
  let component: UseCasesActionCardComponent;
  let fixture: ComponentFixture<UseCasesActionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UseCasesActionCardComponent]
    });
    fixture = TestBed.createComponent(UseCasesActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
