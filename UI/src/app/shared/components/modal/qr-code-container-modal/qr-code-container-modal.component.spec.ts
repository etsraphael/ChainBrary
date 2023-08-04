import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from './../../../../module/material.module';
import { QrCodeContainerModalComponent } from './qr-code-container-modal.component';
import { SharedComponentsModule } from '../../shared-components.module';

describe('QrCodeContainerModalComponent', () => {
  let component: QrCodeContainerModalComponent;
  let fixture: ComponentFixture<QrCodeContainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule],
      declarations: [QrCodeContainerModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            qrCodeValue: 'test'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
