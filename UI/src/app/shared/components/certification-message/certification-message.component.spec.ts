import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationMessageComponent } from './certification-message.component';

describe('CertificationMessageComponent', () => {
  let component: CertificationMessageComponent;
  let fixture: ComponentFixture<CertificationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificationMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
