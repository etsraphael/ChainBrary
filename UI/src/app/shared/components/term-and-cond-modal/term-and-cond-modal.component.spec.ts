import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermAndCondModalComponent } from './term-and-cond-modal.component';

describe('TermAndCondModalComponent', () => {
  let component: TermAndCondModalComponent;
  let fixture: ComponentFixture<TermAndCondModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermAndCondModalComponent]
    });
    fixture = TestBed.createComponent(TermAndCondModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
