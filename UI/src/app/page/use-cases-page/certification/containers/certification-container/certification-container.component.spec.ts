import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationContainerComponent } from './certification-container.component';

describe('CertificationContainerComponent', () => {
  let component: CertificationContainerComponent;
  let fixture: ComponentFixture<CertificationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificationContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
