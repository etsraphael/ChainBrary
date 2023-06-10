import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeContainerModalComponent } from './qr-code-container-modal.component';

describe('QrCodeContainerModalComponent', () => {
  let component: QrCodeContainerModalComponent;
  let fixture: ComponentFixture<QrCodeContainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrCodeContainerModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
