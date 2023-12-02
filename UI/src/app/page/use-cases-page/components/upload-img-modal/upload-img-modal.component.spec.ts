import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from '../user-cases-shared-components.module';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { UploadImgModalComponent } from './upload-img-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('UploadImgModalComponent', () => {
  let component: UploadImgModalComponent;
  let fixture: ComponentFixture<UploadImgModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [UploadImgModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(UploadImgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
