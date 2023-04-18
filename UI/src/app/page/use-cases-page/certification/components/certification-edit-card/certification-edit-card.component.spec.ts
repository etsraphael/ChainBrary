import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationEditCardComponent } from './certification-edit-card.component';

describe('CertificationEditCardComponent', () => {
  let component: CertificationEditCardComponent;
  let fixture: ComponentFixture<CertificationEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificationEditCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificationEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
